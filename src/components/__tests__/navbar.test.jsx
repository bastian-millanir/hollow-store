import { render } from "@testing-library/react";
import Navbar from '../navbar/navbar.jsx';
import { describe, it, expect } from "vitest";

describe('Componente navbar', () => {
  it('debe contener los enlaces de navegación', () => {
      const { container } = render(<Navbar />);

      // Testear los enlaces de navegación tanto en versión desktop como mobile
      const contactoDesktop = container.querySelector('#contacto-nav');
      const contactoMobile = container.querySelector('#contacto-nav-mobile');
      const quienesDesktop = container.querySelector('#about-nav');
      const quienesMobile = container.querySelector('#about-nav-mobile');
      const brandDesktop = container.querySelector('#logo-brand-nav');
      const brandMobile = container.querySelector('#logo-brand-nav-mobile');

      expect(contactoDesktop).toBeTruthy();
      expect(contactoDesktop.getAttribute('href')).toBe('/contacto');

      expect(contactoMobile).toBeTruthy();
      expect(contactoMobile.getAttribute('href')).toBe('/contacto');

      expect(quienesDesktop).toBeTruthy();
      expect(quienesDesktop.getAttribute('href')).toBe('/about');

      expect(quienesMobile).toBeTruthy();
      expect(quienesMobile.getAttribute('href')).toBe('/about');

      expect(brandDesktop).toBeTruthy();
      expect(brandDesktop.getAttribute('href')).toBe('/');

      expect(brandMobile).toBeTruthy();
      expect(brandMobile.getAttribute('href')).toBe('/');
  });
});