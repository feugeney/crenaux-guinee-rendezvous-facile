
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4 text-coaching-900">DomConsulting</h3>
            <p className="text-gray-600">
              Votre partenaire pour le développement personnel et professionnel avec Mme Domani Doré.
              Réservez une séance de coaching personnalisée dès aujourd'hui.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3 text-coaching-900">Liens rapides</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-coaching-700">Accueil</Link></li>
              <li><Link to="/booking" className="text-gray-600 hover:text-coaching-700">Réserver un créneau</Link></li>
              <li><a href="#" className="text-gray-600 hover:text-coaching-700">À propos</a></li>
              <li><a href="#" className="text-gray-600 hover:text-coaching-700">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-3 text-coaching-900">Contact</h4>
            <address className="not-italic text-gray-600">
              <p>Conakry, Guinée</p>
              <p>Email: contact@domconsulting.com</p>
              <p>Téléphone: +224 XX XX XX XX</p>
            </address>
          </div>
        </div>
        <div className="border-t mt-8 pt-4 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} DomConsulting - Domani Doré. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
