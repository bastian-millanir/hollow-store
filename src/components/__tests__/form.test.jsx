import { render , screen , fireEvent } from "@testing-library/react";
import form from '../navbar.jsx';
import { describe, expect } from "vitest";
describe('Componente navbar',() => {
    it('debe contener los campos del formulario', () => {
        render(<form/>);
        const nombre = screen.getByLabelText(/Nombre/i);
        const email = screen.getByLabelText(/Email/i);
        const mensaje = screen.getByLabelText(/Mensaje/i);
        const boton = screen.getByRole('button',{name: /Enviar/i});

        fireEvent.change(nombre,{target:{value:'Juan'}});
        fireEvent.change(nombre,{target:{value:'juantest'}});
         
        expect(nombre).toBeTruthy();
 
    })

});
