import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button UI Component', () => {
    it('renders the button with text', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('handles click events', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Submit</Button>);

        fireEvent.click(screen.getByText('Submit'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders a disabled state correctly', () => {
        render(<Button disabled>Disabled Btn</Button>);
        expect(screen.getByText('Disabled Btn')).toBeDisabled();
    });

    it('applies different variants properly', () => {
        const { container } = render(<Button variant="destructive">Delete</Button>);
        // Testing tailwind rendering implementation
        expect(container.firstChild).toHaveClass('bg-destructive text-destructive-foreground');
    });

    it('can render as a child element (asChild prop)', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        const link = screen.getByRole('link', { name: "Link Button" });
        expect(link).toHaveAttribute('href', '/test');
    });
});
