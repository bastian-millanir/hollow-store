import { render, screen, fireEvent } from "@testing-library/react";
import Form from "../form/form.jsx";
import { describe, it, expect, vi } from "vitest";

describe('Componente formulario', () => {
  it('debe contener los campos del formulario', () => {
    render(<Form />);
    const nombre = screen.getByLabelText(/Nombre/i);
    const apellido = screen.getByLabelText(/Apellido/i);
    const email = screen.getByLabelText(/Email/i);
    const direccion = screen.getByLabelText(/Dirección/i);
    const region = screen.getByLabelText(/Región/i);
    const comuna = screen.getByLabelText(/Comuna/i);
    const mensaje = screen.getByLabelText(/Mensaje/i);

    expect(nombre).toBeTruthy();
    expect(apellido).toBeTruthy();
    expect(email).toBeTruthy();
    expect(direccion).toBeTruthy();
    expect(region).toBeTruthy();
    expect(comuna).toBeTruthy();
    expect(mensaje).toBeTruthy();
  });

  it('debe mostrar alert al enviar datos válidos y limpiar los campos', () => {
    render(<Form />);
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    const nombre = screen.getByLabelText(/Nombre/i);
    const apellido = screen.getByLabelText(/Apellido/i);
    const email = screen.getByLabelText(/Email/i);
    const direccion = screen.getByLabelText(/Dirección/i);
    const region = screen.getByLabelText(/Región/i);
    const comuna = screen.getByLabelText(/Comuna/i);
    const mensaje = screen.getByLabelText(/Mensaje/i);
    const boton = screen.getByText(/Enviar/i);

    fireEvent.change(nombre, { target: { value: 'Juan' } });
    fireEvent.change(apellido, { target: { value: 'Pérez' } });
    fireEvent.change(email, { target: { value: 'juan@example.com' } }); // email válido
    fireEvent.change(direccion, { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(region, { target: { value: 'Región Metropolitana de Santiago' } });
    fireEvent.change(comuna, { target: { value: 'Santiago' } });
    fireEvent.change(mensaje, { target: { value: 'Prueba juan' } });

    fireEvent.click(boton);

    expect(window.alert).toHaveBeenCalled();

    expect(nombre.value).toBe('');
    expect(apellido.value).toBe('');
    expect(email.value).toBe('');
    expect(direccion.value).toBe('');
    expect(region.value).toBe('');
    expect(comuna.value).toBe('');
    expect(mensaje.value).toBe('');

    window.alert.mockRestore();
  });


  it('debe mostrar mensaje de envío gratis para RM y comunas permitidas', () => {
    const { container } = render(<Form />);
    vi.spyOn(window, 'alert').mockImplementation(() => {});

    const nombre = screen.getByLabelText(/Nombre/i);
    const apellido = screen.getByLabelText(/Apellido/i);
    const email = screen.getByLabelText(/Email/i);
    const direccion = screen.getByLabelText(/Dirección/i);
    const region = screen.getByLabelText(/Región/i);
    const comuna = screen.getByLabelText(/Comuna/i);
    const mensaje = screen.getByLabelText(/Mensaje/i);
    const boton = screen.getByText(/Enviar/i);

    fireEvent.change(nombre, { target: { value: 'Juan' } });
    fireEvent.change(apellido, { target: { value: 'Pérez' } });
    fireEvent.change(email, { target: { value: 'juan@example.com' } });
    fireEvent.change(direccion, { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(region, { target: { value: 'Región Metropolitana de Santiago' } });
    fireEvent.change(comuna, { target: { value: 'Ñuñoa' } });
    fireEvent.change(mensaje, { target: { value: 'Prueba envío gratis' } });

    fireEvent.click(boton);

    const mensajeDiv = container.querySelector('#mensaje-envio-gratis');
    expect(mensajeDiv).toBeTruthy();
    expect(mensajeDiv.textContent).toBe('¡Tu envío es gratis en esta comuna!');

    window.alert.mockRestore();
  });
});