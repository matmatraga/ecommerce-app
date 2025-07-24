import React from 'react';
import {Link} from 'react-router-dom';

const NotFound = () => {
  return (
    <div className = 'text-center'>
      <h1 className = 'mt-3'>404 - Page Not Found</h1>
      <p>Go back to {''} <Link to = '/' className = "text-decoration-none"> homepage</Link>.</p>
    </div>
  );
};

export default NotFound;