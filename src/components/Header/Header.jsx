import React from 'react';
import { Container, Logo, LogoutBtn } from "../index"
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "My Posts",
      slug: "/my-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  return (
    <header className='py-1 shadow bg-gray-500'>
      <Container>
        <nav className='flex items-center justify-center'>
          <div className='mr-4'>
            <Link to={'/'}>
              <Logo width='70px' />
            </Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((navItem) =>
              navItem.active ? (
                <li key={navItem.name}>
                  <button
                    onClick={() => navigate(navItem.slug)}
                    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
                  >
                    {navItem.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;