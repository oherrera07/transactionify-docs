import React from 'react';
import DefaultNavbarItem from '@theme-original/NavbarItem/DefaultNavbarItem';

export default function DefaultNavbarItemWrapper(props) {
  const isFile = props.href?.match(/\.(pdf|zip|docx|xlsx|json)$/i);
  return (
    <DefaultNavbarItem
      {...props}
      target={isFile ? '_blank' : props.target}
      rel={isFile ? 'noopener noreferrer' : props.rel}
    />
  );
}