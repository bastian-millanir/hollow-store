import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-dark text-white py-4 mt-5">
      <div className="container text-center">
        <h5 id="title-footer">Sleepy Hollow</h5>
        <p id="content-footer">
          &copy; {year} Sleepy Hollow. Tienda gótica para almas nocturnas.
          <br />
          Síguenos en{' '}
          <a href="#" className="text-decoration-none text-secondary">Instagram</a>{' '}
          y{' '}
          <a href="#" className="text-decoration-none text-secondary">Facebook</a>
        </p>
        <div id="iconos-footer-darks">
          <i className="bi bi-moon-stars-fill" aria-hidden="true"></i>
          <i className="bi bi-heart-fill ms-3" aria-hidden="true"></i>
          <i className="bi bi-gem ms-3" aria-hidden="true"></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;