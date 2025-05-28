
import React from "react";

interface BookingQuestionsSectionProps {
  questions?: string;
}

const BookingQuestionsSection: React.FC<BookingQuestionsSectionProps> = ({ questions }) => {
  if (!questions) return null;

  return (
    <div>
      <h3 className="font-semibold">Questions ou précisions</h3>
      <p className="whitespace-pre-wrap">{questions}</p>
    </div>
  );
};

export default BookingQuestionsSection;
