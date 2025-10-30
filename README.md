# 🕵️ Brooklyn Nine-Nine: Halloween Heist BFS Visualizer

A fun, interactive visualization of the **Brooklyn Nine-Nine Halloween Heist**, built with a **multi-agent BFS algorithm** and a **pixel-art precinct map**.  
Detectives like Jake, Amy, and Rosa race across the grid to reach the trophy first — unlocking doors, cooperating, and competing in true Nine-Nine style!

---

## 🎯 Overview

This project combines **algorithmic logic** and **visual storytelling**.  
The backend uses **Python** to simulate a multi-source BFS (Breadth-First Search) where detectives move simultaneously with shared state management for locked doors.  
The frontend visualizes this process using **React**, **TailwindCSS**, and **Canvas** with animated pixel detectives moving through a retro precinct map.

---

## ⚙️ Features

- 🗺️ Interactive 2D grid visualization of the precinct  
- 🧩 Detectives with unique avatars and colors  
- 🔐 Locked doors and cooperative key mechanics  
- ⏱️ Step-by-step BFS progression with animations  
- 🏆 Glowing trophy and victory celebration  
- 🎮 Controls for Start, Pause, Reset, and Speed adjustment  
- 💡 Brooklyn Nine-Nine inspired theme and humor  

---

## 🧠 Algorithm

The Python backend implements a **multi-agent BFS**:
- Each detective starts from their position, possibly carrying a key.
- Detectives move simultaneously across the grid.
- When any detective with a key reaches a locked door, it unlocks for all others.
- The algorithm finds the **minimum time** for any detective to reach the trophy.
- If multiple reach simultaneously, the lexicographically smallest name wins.

Example Input:
5 5 3
Jake 0 0 1
Amy 4 4 0
Rosa 2 0 0
2 2
2
1 2
2 1

Example Output:
3
Jake

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

- ❤️ Acknowledgements

Inspired by the humor and chaos of Brooklyn Nine-Nine.
Built for fun, learning, and celebrating algorithms with style.
Nine-Nine!

Developed by:
👨‍💻 Arnab Mandal
👨‍💻 Krishna Mohan
👨‍💻 Chetan Anand
