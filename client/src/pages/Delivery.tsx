import React from 'react';

const Delivery: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Доставка</h1>
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">Способы доставки</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Курьерская доставка по городу</li>
          <li>Самовывоз из нашего магазина</li>
          <li>Почтовая доставка по России</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Сроки доставки</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Курьерская доставка: 1-2 рабочих дня</li>
          <li>Самовывоз: в день заказа</li>
          <li>Почтовая доставка: 3-14 рабочих дней</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Стоимость доставки</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Курьерская доставка: от 300 рублей</li>
          <li>Самовывоз: бесплатно</li>
          <li>Почтовая доставка: рассчитывается индивидуально</li>
        </ul>
      </div>
    </div>
  );
};

export default Delivery; 