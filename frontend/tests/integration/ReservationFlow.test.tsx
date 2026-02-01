import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../src/pages/Home';
import { AuthProvider } from '../../src/context/AuthContext';
import { describe, test, expect } from 'vitest';

describe('Integración del Flujo de Reservas', () => {
    test('renderiza el formulario, permite completarlo y enviarlo exitosamente', async () => {
        const user = userEvent.setup();

        render(
            <AuthProvider>
                <MemoryRouter>
                    <Home />
                </MemoryRouter>
            </AuthProvider>
        );

        expect(screen.getByText('La Maison')).toBeInTheDocument();

        const startTimeInput = screen.getByLabelText(/Hora Inicio/i);
        await user.type(startTimeInput, '13:00');

        const endTimeInput = screen.getByLabelText(/Hora Fin/i);
        await user.type(endTimeInput, '14:00');

        const peopleSelect = screen.getByLabelText(/Comensales/i);
        await user.selectOptions(peopleSelect, '4');

        await waitFor(() => {
            expect(screen.getByText('Interior')).toBeInTheDocument();
        });

        const tableBtn = screen.getByText('Interior');
        await user.click(tableBtn);

        const nameInput = screen.getByLabelText(/Nombre completo/i);
        await user.type(nameInput, 'Test User');

        const emailInput = screen.getByLabelText(/Correo electrónico/i);
        await user.type(emailInput, 'test@example.com');

        const submitBtn = screen.getByRole('button', { name: /Confirmar Reserva/i });
        expect(submitBtn).toBeEnabled();

        await user.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Reserva Confirmada')).toBeInTheDocument();
        });

        expect(screen.getByText('Le hemos enviado los detalles a su correo')).toBeInTheDocument();
    });
});
