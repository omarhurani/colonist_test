# Colonist Test Game - Ping Pong

This is my take on the ping pong game requested by the awesome people at [Colonist.io](https://colonist.io/) as a test. If you like [Catan](https://www.catan.com/), or board games in general, give them a visit, I'm sure you'll love it 😁



## Demo
https://user-images.githubusercontent.com/26940488/154147153-5ad290fd-379d-41b6-81e1-ed9d5a75879c.mp4

## Gameplay
This is a two-player game. Or one-player if you want to play with both paddles, could also work with 4 players... It is for sure a two-paddle game.

The goal is to prevent the ball from sneaking behind your paddle and hitting the wall by deflecting it using the paddle. The ball's trajectory depends on where on the paddle does it hit, the more to the side, the more extreme the trajectory of the ball will be when it bounces.

Oh, also make sure your audio isn't too loud 😉

## Controls
| Action | Control |
| - | - |
| Move left paddle | `W` / `S` |
| Move right paddle | `↑` / `↓` |
| Pause/resume | `SPACE` |

## Techincal Shenanigans

This app was purely made using HTML5, CSS and Javascript, no external libraries (except for the Node server and Express which were part of the template).

I am used to working with [Flutter](https://flutter.dev/) and haven't worked on a web project in a while, so please pardon anything that makes you facepalm 🤦‍♂️

I seperated the functionalities across multiple files and used classes with polymorphism to better structure the code.

Here are some functions you might want to play around with while testing the game:
| Function | Functionality | Notes |
| - | - | - |
| `app.start()` | Resumes the game if paused | The game starts as paused, so I thought the simplest implementation of this would be to resume it.
| `app.pause()` | Pauses the game if not paused | If the ball is scored while the pause happens, it will reset (but not start moving) |
| `app.togglePause()` | Resume the game if paused, pauses otherwise | |
| `app.resetBall()` | Freezes the ball for 1.5 seconds, then resets it to the middle of the game with a random trajectory | |
| `app.reset()` | Resets the ball, paddles and scores, and pauses the game | |
