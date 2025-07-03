// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components'; // Usaremos styled-components para las animaciones y estilos

// Definición de las animaciones
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounceIn = keyframes`
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
`;

const pulsate = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(128, 0, 128, 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(128, 0, 128, 0.7);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(128, 0, 128, 0.4);
  }
`;


// Estilos con styled-components
const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Ocupa toda la altura de la ventana */
  background-color: #2a0a4c; /* Morado oscuro de fondo */
  color: #f0e6fa; /* Texto blanco-morado claro */
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 20px;
  box-sizing: border-box; /* Asegura que el padding no cause desbordamiento */
`;

const Title = styled.h1`
  font-size: 8em; /* Más grande para el 404 */
  margin: 0;
  color: #b76e79; /* Un tono de púrpura rojizo o malva */
  text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
  animation: ${bounceIn} 0.8s ease-out; /* Animación para el 404 */
`;

const Subtitle = styled.h2`
  font-size: 2.5em;
  margin: 15px 0 25px;
  color: #d1b3e8; /* Un morado más claro */
  animation: ${fadeIn} 1s ease-out 0.3s forwards; /* Animación con retraso */
  opacity: 0; /* Oculto inicialmente para la animación */
`;

const Description = styled.p`
  font-size: 1.3em;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 30px;
  color: #e0ccf4; /* Un morado muy claro */
  animation: ${fadeIn} 1s ease-out 0.6s forwards; /* Animación con más retraso */
  opacity: 0; /* Oculto inicialmente para la animación */
`;

const HomeLink = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 12px 28px;
  background-color: #800080; /* Un morado estándar */
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  animation: ${pulsate} 2s infinite ease-in-out; /* Animación de pulsación para el botón */
  
  &:hover {
    background-color: #6a006a; /* Morado más oscuro al pasar el ratón */
    transform: translateY(-3px); /* Pequeño efecto de levantamiento */
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
    animation: none; /* Detiene la animación de pulsación al hacer hover */
  }

  &:active {
    transform: translateY(0);
  }
`;

const NotFound = () => {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Subtitle>Página No Encontrada</Subtitle>
      <Description>
        Lo sentimos mucho, pero la página que estás buscando no pudo ser encontrada. 
        Puede que la dirección sea incorrecta o que la página haya sido movida.
      </Description>
      <HomeLink to="/">
        Regresar al Inicio
      </HomeLink>
    </NotFoundContainer>
  );
};

export default NotFound;