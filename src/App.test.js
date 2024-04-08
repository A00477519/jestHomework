import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import List from './components/list';
import Item from './components/item';

describe('App component tests', () => {
  // 1. Test Case One
  // Test that the App Component Renders Correctly
  test('renders App component with menu and image', () => {
    render(<App />);

    // Check for Hello Canada heading
    expect(screen.getByText('Hello Canada')).toBeInTheDocument();

    // Check for Canada flag image
    expect(screen.getByAltText("Canada's Flag")).toBeInTheDocument();

    // Check for menu items
    expect(screen.getByText('Provinces')).toBeInTheDocument();
    expect(screen.getByText('Territories')).toBeInTheDocument();
  });



  // 2. Test Case Two
  // Test Item Component Toggle show capital button
  test('Item component button toggles capital display', async () => {
    render(<App />);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const toggleButtons = document.querySelectorAll('.btn-capital-show');
    const toggleButton = toggleButtons[1];

    fireEvent.click(toggleButton);

    // Check that the capital is shown
    expect(screen.getByText('Toronto')).toBeInTheDocument();

    // Click again to hide the capital
    fireEvent.click(toggleButton);

    // Check that the capital is no longer displayed
    expect(screen.queryByText('Toronto')).not.toBeInTheDocument();
  });



  // 3. Test Case Three
  // Test Menu Interaction of Territories
  test('menu interaction updates on click of Territories', async () => {
    render(<App />);
    await new Promise(resolve => setTimeout(resolve, 2000));

    fireEvent.click(screen.getByText('Territories'));

    await new Promise(resolve => setTimeout(resolve, 2000));

    expect(screen.getByText('Yukon')).toBeInTheDocument();
  });


  
  // 4. Test Case Four
  // Test that Fetching Data Updates State
  test('fetching data updates state with provinces', async () => {
    const fakeData = [{ name: 'Saskatchewan', capital: 'Regina', flagUrl: '/saskatchewan-flag.svg' }];
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({ json: () => Promise.resolve(fakeData) })
    );

    render(<App />);

    // Wait for the fake data to be set
    await waitFor(() => expect(screen.getByText('Saskatchewan')).toBeInTheDocument());

    // Clean up mock to prevent leak
    global.fetch.mockClear();
    delete global.fetch;
  });


  // 5. Test Case Five
  // Test Menu Interaction of Provinces after clicking Territories
  test('menu interaction updates on click of Provinces', async () => {
    render(<App />);
    await new Promise(resolve => setTimeout(resolve, 1000));

    fireEvent.click(screen.getByText('Territories'));

    await new Promise(resolve => setTimeout(resolve, 1000));

    fireEvent.click(screen.getByText('Provinces'));

    await new Promise(resolve => setTimeout(resolve, 1000));

    expect(screen.getByText('Quebec')).toBeInTheDocument();
  });



  
});