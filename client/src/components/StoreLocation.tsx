import React from 'react';
import { MapPin, Phone, Clock, Mail } from 'react-feather';

const StoreLocation: React.FC = () => {
  const storeLocation = {
    lat: 53.9045, // Minsk coordinates
    lng: 27.5615,
    address: 'ул. Независимости, 123, Минск, Беларусь',
    phone: '+375 (29) 123-45-67',
    email: 'info@seedshop.by',
    workingHours: 'Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 16:00, Вс: выходной'
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Наш магазин</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Адрес</h3>
                <p className="text-gray-600">{storeLocation.address}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Телефон</h3>
                <p className="text-gray-600">{storeLocation.phone}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                <p className="text-gray-600">{storeLocation.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Часы работы</h3>
                <p className="text-gray-600">{storeLocation.workingHours}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full min-h-[400px]">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2350.712179062931!2d${storeLocation.lng}!3d${storeLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfd35b1e6ad3%3A0xb61b853ddb570d9!2z0JzQuNC90YHQug!5e0!3m2!1sru!2sby!4v1645543212345!5m2!1sru!2sby`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default StoreLocation; 