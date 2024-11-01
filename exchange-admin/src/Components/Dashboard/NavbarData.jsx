import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';

export const NavbarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'Partners',
    path: '/partners',
    icon: <FaIcons.FaMoneyBillWave />,
    cName: 'nav-text'
  },
  {
    title: 'Locations',
    path: '/locations',
    icon: <FaIcons.FaLocationArrow />,
    cName: 'nav-text'
  },
  {
    title: 'Currency',
    path: '/currency',
    icon: <FaIcons.FaMoneyBillWave />,
    cName: 'nav-text'
  }, 
  {
    title: 'Rates',
    path: '/rates',
    icon: <FaIcons.FaExchangeAlt />,
    cName: 'nav-text'
  }
];