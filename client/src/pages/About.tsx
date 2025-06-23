import React from 'react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">О нас</h1>
      <div className="prose max-w-none">
        <p className="mb-6">
          Мы - интернет-магазин семян, который предлагает широкий ассортимент качественных семян различных растений.
          Наша миссия - помочь вам вырастить красивый и здоровый сад.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Наши преимущества</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Качественные семена от проверенных поставщиков</li>
          <li>Широкий ассортимент продукции</li>
          <li>Профессиональные консультации по выращиванию</li>
          <li>Быстрая доставка по всей России</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Наша история</h2>
        <p className="mb-6">
          Наш магазин был основан в 2010 году группой энтузиастов-садоводов. 
          За годы работы мы помогли тысячам клиентов создать прекрасные сады и огороды.
        </p>
      </div>
    </div>
  );
};

export default About; 