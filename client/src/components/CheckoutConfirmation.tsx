import React from 'react';
import { CartItem } from '../types/cart';
import { User } from '../contexts/AuthContext';

interface CheckoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cartItems: CartItem[];
  user: User;
  totalAmount: number;
}

const CheckoutConfirmation: React.FC<CheckoutConfirmationProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cartItems,
  user,
  totalAmount,
}) => {
  if (!isOpen) return null;

  const deliveryAddress = user.addresses?.[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Подтверждение заказа</h2>
        
        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Товары в заказе:</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-600">Количество: {item.quantity}</p>
                </div>
                <p className="font-medium">{item.product.price * item.quantity} BYN</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <p className="text-lg font-bold">Итого: {totalAmount} BYN</p>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Информация о доставке:</h3>
          {deliveryAddress ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><span className="font-medium">Адрес:</span> {deliveryAddress.address}</p>
              <p><span className="font-medium">Город:</span> {deliveryAddress.city}</p>
              <p><span className="font-medium">Индекс:</span> {deliveryAddress.postal_code}</p>
              <p><span className="font-medium">Телефон:</span> {deliveryAddress.phone}</p>
            </div>
          ) : (
            <p className="text-red-600">Пожалуйста, заполните информацию о доставке в профиле</p>
          )}
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Информация об оплате:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-2">Оплата производится наложенным платежом при получении заказа.</p>
            <p className="mb-2">Доставка осуществляется по всей территории Республики Беларусь.</p>
            <p className="mb-2">Срок доставки: 1-3 рабочих дня.</p>
            <p className="text-sm text-gray-600">* При оформлении заказа вы соглашаетесь с условиями доставки и оплаты</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={!deliveryAddress}
            className={`px-4 py-2 rounded-md text-white ${
              deliveryAddress
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Подтвердить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmation; 