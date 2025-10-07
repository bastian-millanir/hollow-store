import { render , screen } from "@testing-library/react";
import navbar from '../navbar.jsx';
import {describe,  expect } from "vitest";
describe('Componente navbar',() => {

    it('debe contener los enlaces de navegacion',() => {

        render(<navbar/>);
        const linkProductos = screen.getByText(/producto/i
        );
        const linkContacto = screen.getByText(/Contacto/);

        expect (linkProductos).toBeTruthy();
        expect (linkProductos).toBeTruthy();
    }

    );
});