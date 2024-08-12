# Sequence Board Game

## Overview

This project is a multiplayer Sequence board game built using React and WebSockets, designed for four players (two teams of two). The game includes dynamic board generation, real-time gameplay, and comprehensive game state management to ensure a seamless user experience.

## Features

- **Multiplayer Functionality:** Supports four players in real-time, with two teams competing to create a sequence of five chips.
- **Dynamic Board Generation:** The Sequence board is dynamically generated using React components, allowing for flexible gameplay.
- **Turn-Based Gameplay:** Players take turns to play cards, with real-time updates ensuring all players see the latest game state.
- **Card Management:** Each player receives a set of six cards from a shuffled deck, with the ability to play valid moves or use jacks to place chips strategically.
- **Winning Condition:** The game detects and announces the winning team once a sequence of five chips is achieved, or declares a draw if no winner is determined after 12 moves.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/sequence-board-game.git
    ```

2. Navigate to the project directory:

    ```bash
    cd sequence-board-game
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Start the server:

    ```bash
    node server.js
    ```

5. Open `client.html` in your browser to start the game.

## How to Play

1. Four players join the game, and each is assigned a color (blue or green).
2. Players take turns to place chips on the board by playing cards from their hand.
3. The goal is to form a sequence of five chips in a row, column, or diagonally.
4. The first team to achieve this wins the game, and the game state is updated for all players in real-time.

## Project Structure

- `client.html`: The main HTML file that hosts the game.
- `client.js`: Contains the client-side logic, including state management and WebSocket communication.
- `server.js`: Manages the WebSocket server
