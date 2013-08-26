# Sandbox

Sandbox-style roleplaying massive online game with indirect character control and world simulation. Currently in 2d with multiple z-levels (like in dwarf fortress).

Runs both on clientside and server. 

## What's done

* Basic data system
* Map walking
* Spiral searches and pathfinding
* Basic fractal map

## Planned features

* Behavior simulation
* Economy simulation
* City cimulation
* Procedurally generated world
* 520x520km world with full persistense with 99 z-levels
* Fractal map with level of detail.
* Tree growing and renewable resources
* Quest generation

## Can I help?

Yes, please.

The game's going to be big, so there're multiple things that could be done separately from current development:

* GPU generated world. Like in this example: glsl.heroku.com/e#10449.0, bit without all the ray-casting.
* Graphics, visuals, sprites. Out of scope for us now, but contributions are welcome.
* Custom storage in C to persist collections of 64bit numbers, index and make very simple queries. We have parts of that working in js, but apparently they will not be enough
* Anything else from the list of planned features. Contact me if you're not sure so we can figure out something useful and fun.

## How see examples?
See examples/hunger.html:

http://inviz.ru/sandbox/examples/hunger.html?interval=100

## How to join or contact you?

Name's Yaroslaff Fedin
invizko@gmail.com

Currently unemployed. Drop me a letter if you have some good position in mind.
