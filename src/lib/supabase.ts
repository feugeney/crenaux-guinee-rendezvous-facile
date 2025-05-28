
import { createClient } from '@supabase/supabase-js';

// Default Stripe test keys for development
export const DEFAULT_STRIPE_PUBLIC_KEY = 'pk_test_51RM6m7PA7CEFsDFehRpLsppOaew9uHfU1jJbXgNteiIl5fAenyQQss8Or0hpTKkQFmFzEfIY8r0imkQPhoWYy7Bc00Puyb2xca';

// List of Edge Functions that should open the Stripe site directly
const DIRECT_STRIPE_FUNCTIONS = ['stripe-checkout', 'stripe-subscription'];

// Queue system for email sending to respect SMTP rate limits
const EMAIL_QUEUE = [];
const EMAIL_INTERVAL_SECONDS = 60; // Minimum seconds between emails
let isProcessingQueue = false;

// Process the email queue
const processEmailQueue = async () => {
  if (isProcessingQueue || EMAIL_QUEUE.length === 0) return;
  
  isProcessingQueue = true;
  const nextEmail = EMAIL_QUEUE.shift();
  
  try {
    await nextEmail.sendFunction();
    console.log('Email sent from queue');
  } catch (error) {
    console.error('Error sending email from queue:', error);
    // Optionally requeue failed emails
  }
  
  isProcessingQueue = false;
  
  // Schedule next email after the interval
  if (EMAIL_QUEUE.length > 0) {
    setTimeout(() => {
      processEmailQueue();
    }, EMAIL_INTERVAL_SECONDS * 1000);
  }
};

// Function to get the full Supabase URL for functions
export const getSupabaseFunctionUrl = (functionName: string) => {
  const supabaseUrl = "https://ulfdphrinlzjlzejkyno.supabase.co";
  return `${supabaseUrl}/functions/v1/${functionName}`;
};

// Utility function to safely create a Supabase client
export const createSafeSupabaseClient = () => {
  try {
    const supabaseUrl = "https://ulfdphrinlzjlzejkyno.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZmRwaHJpbmx6amx6ZWpreW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODQxNTYsImV4cCI6MjA2MzA2MDE1Nn0.ExV5y6UrmSxdL8hcJu0eCiOlA7u5ZKmKKTYiIw9ZGiM";
    
    // Create the actual Supabase client
    const client = createClient(supabaseUrl, supabaseAnonKey);
    
    // Helper function to call Edge Functions directly with proper headers
    const callEdgeFunction = async (name: string, options?: any) => {
      const url = `${supabaseUrl}/functions/v1/${name}`;
      
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: options?.body ? JSON.stringify(options.body) : undefined,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error from ${name} function:`, errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    };
    
    // Extend the functions.invoke method to handle email rate limiting and add direct call method
    const originalInvoke = client.functions.invoke;
    client.functions.invoke = async (name: string, options?: any) => {
      console.log(`Calling function: ${name} with options:`, options);
      
      // For functions that need direct fetch calling
      if (name === 'send-smtp-email' || name === 'smtp-test-email') {
        return callEdgeFunction(name, options);
      }
      
      // For the send-email function, use our queue system
      if (name === 'send-email') {
        return new Promise((resolve, reject) => {
          // Add to queue
          EMAIL_QUEUE.push({
            sendFunction: async () => {
              try {
                const result = await originalInvoke.call(client.functions, name, options);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            }
          });
          
          // Start processing if not already running
          processEmailQueue();
        });
      }
      
      // For Stripe functions that should open directly
      if (DIRECT_STRIPE_FUNCTIONS.includes(name)) {
        console.log(`Redirecting to Stripe for function ${name}...`);
        return originalInvoke.call(client.functions, name, options);
      }
      
      // For all other functions
      return originalInvoke.call(client.functions, name, options);
    };
    
    return client;
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    
    // Return a mock client with improved error handling for Edge Functions
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        insert: async () => ({ data: null, error: null }),
        upsert: async () => ({ data: null, error: null }),
        delete: async () => ({ data: null, error: null }),
      }),
      functions: {
        invoke: async (name: string, options?: any) => {
          console.warn(`Simulated call to function ${name} because Supabase is not properly initialized`);
          
          // For functions that should redirect to Stripe, return a test URL
          if (DIRECT_STRIPE_FUNCTIONS.includes(name)) {
            console.log(`Redirecting to Stripe for function ${name}...`);
            
            return { 
              data: { url: "https://checkout.stripe.com/redirect" }, 
              error: null 
            };
          }
          
          return { 
            data: null, 
            error: { message: "Supabase client is not initialized. Please check your environment variables." } 
          };
        }
      },
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      }
    } as any;
  }
};

// Create a singleton instance of the Supabase client
export const supabase = createSafeSupabaseClient();

// Function to get the Stripe public key (client-side usable)
export const getStripePublicKey = async () => {
  try {
    // Check if there's a key stored in Supabase
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'stripe_public_key')
      .single();
    
    if (!error && data) {
      return data.value;
    }
    
    // Use default key if none is configured
    return DEFAULT_STRIPE_PUBLIC_KEY;
  } catch (error) {
    console.error('Error retrieving Stripe public key:', error);
    return DEFAULT_STRIPE_PUBLIC_KEY;
  }
};
