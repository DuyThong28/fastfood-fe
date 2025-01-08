import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { routes } from '@/config';

const UserHeader = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className='shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] max-sm:hidden md:hidden sm:flex h-16 rounded-b-2xl py-2 px-6 w-full z-50 sticky top-0 justify-between items-center'>
        <div className='flex gap-16 items-center'>
          <ul className='flex gap-2.5'>
              <div className='flex gap-2.5'>
                <NavLink to={routes.CUSTOMER.ACCOUNT_PROFILE} className='cursor-pointer'>
                  <li
                    className={` py-2 px-4 transition-colors duration-300 hover:font-medium hover:bg-slate-100 hover:text-primaryColor rounded-md
                ${
                  pathname == routes.CUSTOMER.ACCOUNT_PROFILE ||
                  (pathname.startsWith(routes.CUSTOMER.ACCOUNT_PROFILE) && pathname !== '/')
                    ? 'bg-white text-primaryColor rounded-md'
                    : 'text-slate-50'
                }
              `}
                  >
                    Tài khoản
                  </li>
                </NavLink>
                <NavLink to={routes.CUSTOMER.ACCOUNT_ADDRESS} className='cursor-pointer'>
                  <li
                    className={` py-2 px-4 transition-colors duration-300 hover:font-medium hover:bg-slate-100 hover:text-primaryColor rounded-md
                ${
                  pathname == routes.CUSTOMER.ACCOUNT_ADDRESS ||
                  (pathname.startsWith(routes.CUSTOMER.ACCOUNT_ADDRESS) && pathname !== '/')
                    ? 'bg-white text-primaryColor rounded-md'
                    : 'text-slate-50'
                }
              `}
                  >
                    Địa chỉ
                  </li>
                </NavLink>
              </div>
              <>
                <NavLink to={routes.CUSTOMER.PURCHASE} className='cursor-pointer'>
                  <li
                    className={` py-2 px-4 transition-colors duration-300 hover:font-medium hover:bg-slate-100 hover:text-primaryColor rounded-md
                  ${
                    pathname == routes.CUSTOMER.PURCHASE ||
                    (pathname.startsWith(routes.CUSTOMER.PURCHASE) && pathname !== '/')
                      ? 'bg-white text-primaryColor rounded-md'
                      : 'text-slate-50'
                  }
                `}
                  >
                    Đơn mua
                  </li>
                </NavLink>
              </>
          </ul>
        </div>
      </div>

      <div className='`md:hidden'>
        {isMenuOpen && (
          <div
            className='fixed inset-0 bg-black opacity-30 z-40'
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}
        <div className='flex md:hidden h-16 bg-[#A93F15] rounded-b-2xl py-2 px-6 w-full z-50 sticky top-0 justify-between items-center'>
          <div className='flex justify-between items-center'>
            <FaBars
              className='text-xl text-white cursor-pointer'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>
        <div
          className={`
          fixed left-0 w-full bg-[#A93F15] p-6 z-50 flex flex-col gap-2.5 transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'top-0' : 'top-[-100%]'}
          md:hidden
        `}
        >
          <ul className='flex flex-col gap-2.5'>
              <div className='flex flex-col gap-2.5'>
                <NavLink to={routes.CUSTOMER.ACCOUNT_PROFILE} className='cursor-pointer'>
                  <li
                    className={` py-2 px-4 transition-colors duration-300 hover:font-medium hover:bg-slate-100 hover:text-primaryColor rounded-md
                  ${
                    pathname == routes.CUSTOMER.ACCOUNT_PROFILE ||
                    (pathname.startsWith(routes.CUSTOMER.ACCOUNT_PROFILE) && pathname !== '/')
                      ? 'bg-white text-primaryColor rounded-md'
                      : 'text-slate-50'
                  }
                `}
                  >
                    Tài khoản
                  </li>
                </NavLink>
                <NavLink to={routes.CUSTOMER.ACCOUNT_ADDRESS} className='cursor-pointer'>
                  <li
                    className={` py-2 px-4 transition-colors duration-300 hover:font-medium hover:bg-slate-100 hover:text-primaryColor rounded-md
                  ${
                    pathname == routes.CUSTOMER.ACCOUNT_ADDRESS ||
                    (pathname.startsWith(routes.CUSTOMER.ACCOUNT_ADDRESS) && pathname !== '/')
                      ? 'bg-white text-primaryColor rounded-md'
                      : 'text-slate-50'
                  }
                `}
                  >
                    Địa chỉ
                  </li>
                </NavLink>
              </div>
              <>
                <NavLink to={routes.CUSTOMER.PURCHASE} className='cursor-pointer'>
                  <li
                    className={` py-2 px-4 transition-colors duration-300 hover:font-medium hover:text-primaryColor hover:bg-slate-100 rounded-md
                    ${
                      pathname == routes.CUSTOMER.PURCHASE ||
                      (pathname.startsWith(routes.CUSTOMER.PURCHASE) && pathname !== '/')
                        ? 'bg-white text-primaryColor rounded-md'
                        : 'text-slate-50'
                    }
                  `}
                  >
                    Đơn mua
                  </li>
                </NavLink>
              </>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UserHeader;
