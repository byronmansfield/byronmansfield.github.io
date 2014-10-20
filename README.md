# Twitch Search Exercise for Sony #

## Description ##
This is a coding exercise for Sony. The exercise is should make ajax requests to Twitch API and display the results. It can be viewed at [http://byronmansfield.github.io/](http://byronmansfield.github.io/)

## Requirements ##
_as per email from Nick Barker_
 * Write a simple web app that hits the Twitch API URL `https://api.twitch.tv/kraken/search/streams?q=starcraft`
 * Build the URL based on the query entered by the user in the search box shown in the mock
 * Build out the list as shown in the mock. 
 * All UI elements are mandatory and self-explanatory
 * Feel free to add more/better UI, as long as you include the mandatory elements
 * No frameworks like jQuery/AngularJS.  Just vanilla JS with XHR to hit the API.

## Other Notes ##

Some things to note upon inspection of this exercise. These mentions may be obvious, but thought I would make mention of them anyways. I am aware of some known bugs, and there are some areas where I would like to improve on. I left it as so due to the nature of this exercise, to display to the review my knowledge and understanding of JavaScript Development. It is not intended to be a fully polished production web app. I felt the current state sufficiently displays my JavaScripting skills.

I left some code commented out to show some of my intentions and efforts. I also left in a console log to display the api call returned. In particular because in some cases during development, I would make a successful request and the response was good with the exception of an empty array of streams. This is an inconsistent bug, and was difficult to replicate for debugging.

Another thing I wish to address here is the initial page load. I felt it was not good to have the user land on a blank page. So I decided to add a different ajax request in this project. This request will call for the featured streams. There was a tiny issue with this. There were some properties that where not returned such as total featured. There for it caused some issues such as not being able to display total pages, etc. I figured this would be acceptable because it was not required and I have implemented in the feature for other ajax request which return these properties. I had already begun implementing in this feature before I realized these missing properties.

## Known Bugs ##

 * Some api returns are successful with no data. They rarely happen. Unable to recreate consistently.
 * Error message does not get cleared out
 * Refresh button (on error message) Is not working
 * No disable state for next button on pagination once at last page

## Areas I'd like to improve ##

 * Better Error Handling
 * Optimization - Several functions could be more reusable
 * Build out the styles more
 * More user feed back such as loading spinners while ajax call is being made, etc
 * Would like to make the text for total results reflect the actual query

## Closing ##

This was a fun project to work on. If I have some time, I will continue to improve on this. If there are any questions, concerns, bugs, special requests, or if I simply misunderstood one of the requirements, please submit in issues in this repo or email me at `byron@byronmansfield.com`. I will be more than happy to follow up on any of these. 
