# [Formations](https://trev4ev.github.io/Formations/)

* [Overview](https://github.com/trev4ev/Formations#overview)
* [Tutorial for Choreographers](https://github.com/trev4ev/Formations#tutorial-for-choreographers)
* [Tutorial for Dancers](https://github.com/trev4ev/Formations#tutorial-for-dancers)
* [Features to be Added](https://github.com/trev4ev/Formations#features-to-be-added)

## Overview
Formations is a web application that allows dance choreographers to collaborate on the creation of their formations and share them easily with the other dancers. Formations update in real time so choreographers can edit the same formation at the same time.

Formations is currently in its closed beta and is open to those with an account. Access can be gained by contacting Trevor Aquino (trevoraquino@berkeley.edu).

## Tutorial for Choreographers
Choreographers must have an account created in order to enable editing features.

<img src = "/readme_images/login.png" width = "200"/>

Email, password, and the ID for the dance the choreographer would like to edit must be entered and then the choreographer can login by clicking the ‘Choreographer’ button. Once logged in, the user can see that the application is split into two main parts, the canvas and the controls.

<img src = "/readme_images/multiple_dancers.png" width = "300"/><br><img src = "/readme_images/dancer_edit.png" width = "150"/>

The canvas is a grid that contains all of the dancer objects in the formation. Each dancer is assigned a number, color, and name (optional). Names and colors can be added or changed by holding down the shift key and clicking on the dancer. A text box will then appear and the name can be typed in. The name is saved whenever the user clicks away. Dancers are moved by simply clicking and dragging to the desired location. Dancers can be deleted by pressing the ‘delete’ or ‘backspace’ key.

[WARNING]  Deleting a dancer will delete that dancer from every formation. It is recommended that dancers that are only in some formations are moved to the side to simulate their transition on and off stage.

<img src = "/readme_images/controls.png" width = "600"/>

The controls are what allow the choreographer to add more dancers, change formations, delete formations and add more formations. The two text labels inform the choreographer how many dancers they currently have in their formation and the current formation shown out of the total number of formations. The choreographer can also toggle whether names are visible. The ‘Previous Formation’ and ‘Next Formation’ buttons allow for the choreographer to switch between the current formation. 

[IMPORTANT] If the current formation is the max formation (i.e. Formation: 4 of 4) and the ‘Next Formation’ button is clicked, a new formation will be created and the dancers are automatically set to the same position as the last formation.

<img src = "/readme_images/add_dancers.png" width = "250"/>

Choreographers can add multiple dancers at a time by changing the value in the textbox and clicking ‘Add Dancers.’

[WARNING]  Typing a value that is not a number into the textbox and clicking the button will mess up the dancers

[WARNING] Dancers are automatically added to the top left corner. Adding dancers and then adding again without moving the first dancers will cause overlap. Simply move the dancers to reveal the first set.

## Tutorial for Dancers
After the formations are created, choreographers will share the dance ID with each of their dancers.

<img src = "/readme_images/dancer_login.png" width = "200"/>

Dancers only need to enter the dance ID and login with the ‘Dancer’ button.

<img src = "/readme_images/dancer_controls.png" width = "350"/>

Once logged in, dancers can only switch between the formations to see where they are in each piece. They can also toggle whether the names are visible.

## Features to be Added
* Backup database
* Adjust transition times
* Download formations
