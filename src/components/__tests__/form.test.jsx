import { render , screen , fireEvent } from "@testing-library/react";
import form from '../navbar.jsx';
import { describe, expect } from "vitest";
describe('Componente navbar',() => {
    it('debe contener los campos del formulario', () => {
        render(<Form/>);
        const nombre = screen.getByLabelText(/Nombre/i);
        const email = screen.getByLabelText(/Email/i);
        const mensaje = screen.getByLabelText(/Mensaje/i);
       
        expect(nombre).toBeTruthy();
        expect(email).toBeTruthy();
        expect(mensaje).toBeTruthy();
         
        
    });

    it('debe mostrar alert al enviar datos',()=>{
        render(<Form/>);
        vi.spyOn(window,'alert')
        //SVGPolygonElement()
        const nombre = screen.getByLabelText(/Nombre/i);
        const email = screen.getByLabelText(/Email/i);
        const mensaje = screen.getByLabelText(/Mensaje/i);
        const boton = screen.getByText( /Enviar/i);
        
        fireEvent.change(nombre, {target:{value:'Juan'}});
        fireEvent.change(email, {target:{value:'juantest'}});
        fireEvent.change(mensaje, {target:{value:'Prueba juan'}});
        fireEvent.click(boton);


        expect(window.alert).toHaveBeenCalled();
       expect(nombre.value).toBe('');
       expect(email.value).toBe('');
        expect(mensaje.value).toBe('');

    });

});
