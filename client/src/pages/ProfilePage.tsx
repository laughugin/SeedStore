import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Save } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface UserProfile {
  email: string;
  surname: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

// Belarus cities and their postal codes
const BELARUS_CITIES = [
  { name: 'Минск', postalCode: '220000' },
  { name: 'Гомель', postalCode: '246000' },
  { name: 'Могилев', postalCode: '212000' },
  { name: 'Витебск', postalCode: '210000' },
  { name: 'Гродно', postalCode: '230000' },
  { name: 'Брест', postalCode: '224000' },
  { name: 'Барановичи', postalCode: '225320' },
  { name: 'Борисов', postalCode: '222120' },
  { name: 'Пинск', postalCode: '225710' },
  { name: 'Орша', postalCode: '211030' },
  { name: 'Мозырь', postalCode: '247760' },
  { name: 'Солигорск', postalCode: '223710' },
  { name: 'Новополоцк', postalCode: '211440' },
  { name: 'Лида', postalCode: '231300' },
  { name: 'Молодечно', postalCode: '222310' },
];

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({
    email: user?.email || '',
    surname: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [filteredCities, setFilteredCities] = useState(BELARUS_CITIES);

  useEffect(() => {
    // Here you would typically fetch the user's profile data from your backend
    // For now, we'll just set the email from the auth context
    setProfile(prev => ({ ...prev, email: user?.email || '' }));
  }, [user]);

  const validateProfile = (profile: UserProfile): boolean => {
    const phoneRegex = /^\+375\s[0-9]{2}\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
    const postalCodeRegex = /^[0-9]{6}$/;

    return (
      profile.surname.trim() !== '' &&
      phoneRegex.test(profile.phone) &&
      profile.city.trim() !== '' &&
      postalCodeRegex.test(profile.postalCode) &&
      profile.address.trim() !== ''
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProfile(prev => ({ ...prev, city: value }));
    
    // Filter cities based on input
    const filtered = BELARUS_CITIES.filter(city => 
      city.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCities(filtered);

    // If there's an exact match, set the postal code
    const exactMatch = BELARUS_CITIES.find(city => 
      city.name.toLowerCase() === value.toLowerCase()
    );
    if (exactMatch) {
      setProfile(prev => ({ ...prev, postalCode: exactMatch.postalCode }));
    }
  };

  const handleCitySelect = (city: { name: string; postalCode: string }) => {
    setProfile(prev => ({
      ...prev,
      city: city.name,
      postalCode: city.postalCode
    }));
    setFilteredCities(BELARUS_CITIES);
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const numbers = value.replace(/\D/g, '');
    
    // Format as +375 XX XXX-XX-XX
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `+375 ${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    } else if (numbers.length <= 8) {
      return `+375 ${numbers.slice(0, 2)} ${numbers.slice(2, 5)}-${numbers.slice(5)}`;
    } else {
      return `+375 ${numbers.slice(0, 2)} ${numbers.slice(2, 5)}-${numbers.slice(5, 7)}-${numbers.slice(7, 9)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setProfile(prev => ({ ...prev, phone: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate the profile data
      const isValid = validateProfile(profile);
      
      // Send the updated profile to the backend
      const response = await api.put('/users/profile', {
        surname: profile.surname,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        postal_code: profile.postalCode
      });

      if (response.status !== 200) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = response.data;
      updateUser(updatedUser);

      setMessage(isValid ? 'Профиль успешно обновлен и верифицирован!' : 'Профиль обновлен, но требует заполнения всех полей для верификации');
      setIsEditing(false);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Ошибка при обновлении профиля. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Личный кабинет
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Управление вашими личными данными
            </p>
            {user?.verified && (
              <div className="mt-2 text-sm text-green-600">
                ✓ Профиль верифицирован
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Электронная почта
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profile.email}
                      disabled
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-50"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                      Фамилия
                    </label>
                    <input
                      type="text"
                      name="surname"
                      id="surname"
                      value={profile.surname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={profile.phone}
                      onChange={handlePhoneChange}
                      disabled={!isEditing}
                      required
                      placeholder="+375 XX XXX-XX-XX"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      Город
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={profile.city}
                        onChange={handleCityChange}
                        disabled={!isEditing}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                      {isEditing && profile.city && filteredCities.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                          {filteredCities.map((city, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => handleCitySelect(city)}
                            >
                              {city.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      Почтовый индекс
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      value={profile.postalCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      pattern="[0-9]{6}"
                      placeholder="XXXXXX"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Адрес
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      required
                      placeholder="Улица, дом, квартира"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {message && (
                <div className={`text-sm ${message.includes('успешно') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Редактировать
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setMessage(null);
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Сохранить
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 