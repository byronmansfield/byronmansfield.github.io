/**
 * Twitch Search Single Page App
 * @file This is a SPA Twitch Search Code Exercise
 * @author Byron Mansfield
 */
window.addEventListener('DOMContentLoaded', function() {

	'use strict';

	/*
	 * Global Variable Initializations
	 * @public
	 */
	var twitchSearch = document.getElementById('twitch-search');
	var query = document.getElementById('twich-query');
	var streamList = document.getElementById('stream-list');
	var next = document.getElementById('next');
	var prev = document.getElementById('previous');
	var queryViewed = document.getElementById('query-type');
	var currentPage = document.getElementById('current-page');
	var lastPage = document.getElementById('last-page');
	var totalResults = document.getElementById('total-results');
	var streams;

	/**
	 * View Object
	 */
	var view = {
		currentPage: 1
		, resultsViewed: 'featured'
		, resultsViewedType: 'featured'
		, limit: 10
		, totalStreams: ''
		, totalPages: ''
	}

	/**
	 * Add Click Listeners to DOM elements
	 */
	twitchSearch.addEventListener('click', function() { 
		view.resultsViewed = query;
		view.resultsViewedType = 'query';
		getStreams('first');
	});
	query.addEventListener('keypress', function(e) {
		var key = e.which || e.keyCode;
		if(key == 13) {
			view.resultsViewed = query;
			view.resultsViewedType = 'query';
			getStreams('first');
		}
	});
	next.addEventListener('click', function() { 
		getStreams('next');
	});
	prev.addEventListener('click', function() { 
		getStreams('prev');
	});

	/**
	 * Call Twitch on initial load to provide some filler content
	 * @param {String} - Type of call
	 */
	getStreams('first');

	/**
	 * Handles Twitch API calls
	 * @param {String} - Type
	 */
	function getStreams(type) {

		var script = document.createElement('script');
		var url = makeUrl(type);

		script.src = url;
		script.async = true;

		window['handleResponse'] = function(data) {
			try { 
				handleResponse(data, type);
			} 
			finally {
				delete window['handleResponse'];
				script.parentNode.removeChild( script );
			}
		};
		document.getElementsByTagName('head')[0].appendChild(script);
	}

	/**
	 * AJAX Callback - Handles the response from Twitch
	 * @params {Object} - Response back from Twitch
	 */
	function handleResponse(data, type) {
		console.log(data);
		if(view.resultsViewedType === 'featured') {
			streamList.innerHTML = '';
			updateUi(data, type);
			streams = data.featured;
			for(var item in streams) {
				var newItem = makeNewFeatureItem(streams[item]);
				streamList.appendChild(newItem);
			}
		} else if(view.resultsViewedType === 'query') {
			streamList.innerHTML = '';
			updateUi(data, type);
			streams = data.streams;
			if(streams.length > 0) {
				for(var item in streams) {
					var newItem = makeNewStreamItem(streams[item]);
					streamList.appendChild(newItem);
				}
			} else if(streams.length === 0) {
				notifyUser();
			} else {
				alert("Oops. Something went wrong. Try another search");
			}
		} else {
			alert("Oops. Something went wrong. Try another search");
		}
	}

	/**
	 * Makes the correct URL for API call
	 * @params {String} - Type
	 */
	function makeUrl(type) {
		var url;
		if(view.resultsViewedType === 'featured') {
			url = 'https://api.twitch.tv/kraken/streams/featured?limit=' + view.limit + '&callback=handleResponse';
		} else if(view.resultsViewedType === 'query') {
			query = document.getElementById('twich-query').value;
			if(query === '') {
				url = 'https://api.twitch.tv/kraken/streams/featured?limit=' + view.limit + '&callback=handleResponse';
			} else {
				if(type === 'next') {
					// url = paginationFixer(view.nextPage);
					url = view.nextPage + '&callback=handleResponse';
				} else if(type === 'prev') {
					// url = paginationFixer(view.prevPage);
					url = view.prevPage + '&callback=handleResponse';
				} else if(type === 'retry') {
					url = view.lastCalled + '&callback=handleResponse';
				} else {
					url = 'https://api.twitch.tv/kraken/search/streams?q=' + query + '&callback=handleResponse';
				}
			}
		}
		return url;
	}

	/**
	 * Handles applying correct pagination by correct limit
	 * @params {String} - paginated url from Twitch response
	 */
	function paginationFixer(url) {
		var newUrl, base;
		var params = '';
		var url = str.split(/[\?&]+/);
		base = url[0];
		for(var i = 1; url.length; i++) {
			url = url[i].split('=');
			if(url[0] == 'limit' || url[0] == 'offset') {
				url[1] = view.limit;
				if(params === '') {
					params += url.join('=');
				} else {
					params += '&' + url.join('=');
				}
			}
		}
		newUrl = base + '?' + params + '&callback=handleResponse';
		return newUrl;
	}

	/**
	 * Makes new Stream List Item
	 * @params {Object} - Stream Item
	 * @returns {String}
	 */
	function makeNewFeatureItem(item) {
		// make elements
		var li = document.createElement('li');
		var img = document.createElement('img');
		var h1 = document.createElement('h1');
		var p = document.createElement('p');
		var div = document.createElement('div');
		var name = document.createElement('span');
		var views = document.createElement('span');
		var desc = document.createElement('p');

		// make their text
		var h1Text = document.createTextNode(item.stream.game);
		var nameText = document.createTextNode(item.stream.game + ' - ');
		var viewsText = document.createTextNode(item.stream.viewers + ' views');
		var descText = document.createTextNode(item.text);

		// append their text
		h1.appendChild(h1Text);
		name.appendChild(nameText);
		views.appendChild(viewsText);
		desc.appendChild(descText);

		// now add their classes and attributes
		img.setAttribute('src', item.image);
		img.setAttribute('alt', item.stream.game);
		div.setAttribute('class', 'details');
		p.setAttribute('class', 'lead');
		name.setAttribute('class', 'game-name');
		views.setAttribute('class', 'viewers');
		desc.setAttribute('class', 'description');

		// now append them together
		p.appendChild(name);
		p.appendChild(views);

		div.appendChild(h1);
		div.appendChild(p);
		div.appendChild(desc);

		li.appendChild(img);
		li.appendChild(div);

		return li;
	}

	/**
	 * Makes new Stream List Item
	 * @params {Object} - Stream Item
	 * @returns {String}
	 */
	function makeNewStreamItem(item) {
		// make elements
		var li = document.createElement('li');
		var img = document.createElement('img');
		var h1 = document.createElement('h1');
		var p = document.createElement('p');
		var div = document.createElement('div');
		var name = document.createElement('span');
		var views = document.createElement('span');
		var desc = document.createElement('p');

		// make their text
		var h1Text = document.createTextNode(item.channel.display_name);
		var nameText = document.createTextNode(item.game + ' - ');
		var viewsText = document.createTextNode(item.viewers + ' viewers');
		var descText = document.createTextNode(item.channel.status);

		// append their text
		h1.appendChild(h1Text);
		name.appendChild(nameText);
		views.appendChild(viewsText);
		desc.appendChild(descText);

		// now add their classes and attributes
		img.setAttribute('src', item.preview.large);
		img.setAttribute('alt', item.game);
		div.setAttribute('class', 'details');
		p.setAttribute('class', 'lead');
		name.setAttribute('class', 'game-name');
		views.setAttribute('class', 'viewers');
		desc.setAttribute('class', 'description');

		// now append them together
		p.appendChild(name);
		p.appendChild(views);

		div.appendChild(h1);
		div.appendChild(p);
		div.appendChild(desc);

		li.appendChild(img);
		li.appendChild(div);

		return li;
	}

	/**
	 * Update UI Elements
	 * @params {Object} - Properties to update
	 */
	function updateUi(res, type) {

		switch(type) {
			case 'featured':
				view.currentPage = 1;
				view.nextPage = res._links.next;
				view.prevPage = res._links.prev;
				view.totalStreams = res._total;
				view.lastCalled = res._links.self;
				totalResults.appendChild(document.createTextNode('Unknown'));
				queryViewed.appendChild(document.createTextNode(view.resultsViewedType));
				break;
			case 'first':
				view.currentPage = 1;
				view.nextPage = res._links.next;
				view.prevPage = res._links.prev;
				view.totalStreams = res._total;
				view.lastCalled = res._links.self;
				while(totalResults.firstChild) {
					totalResults.removeChild(totalResults.firstChild);
				}
				totalResults.appendChild(document.createTextNode(view.totalStreams));
				while(queryViewed.firstChild) {
					queryViewed.removeChild(queryViewed.firstChild);
				}
				queryViewed.appendChild(document.createTextNode(view.resultsViewedType));
				break;
			case 'next':
				view.currentPage++;
				view.nextPage = res._links.next;
				view.prevPage = res._links.prev;
				view.totalStreams = res._total;
				view.lastCalled = res._links.self;
				while(totalResults.firstChild) {
					totalResults.removeChild(totalResults.firstChild);
				}
				totalResults.appendChild(document.createTextNode(view.totalStreams));
				while(queryViewed.firstChild) {
					queryViewed.removeChild(queryViewed.firstChild);
				}
				queryViewed.appendChild(document.createTextNode(view.resultsViewedType));
				break;
			case 'prev':
				view.currentPage--;
				view.nextPage = res._links.next;
				view.prevPage = res._links.prev;
				view.totalStreams = res._total;
				view.lastCalled = res._links.self;
				while(totalResults.firstChild) {
					totalResults.removeChild(totalResults.firstChild);
				}
				totalResults.appendChild(document.createTextNode(view.totalStreams));
				while(queryViewed.firstChild) {
					queryViewed.removeChild(queryViewed.firstChild);
				}
				queryViewed.appendChild(document.createTextNode(view.resultsViewedType));
				break;
		}

		if(view.currentPage === 1) {
			prev.className = 'disabled';
		} else {
			prev.className = '';
		}

		if(view.nextPage === 'undefined' || view.nextPage === '' || view.nextPage === 'null') {
			next.className = 'disabled';
		} else {
			next.className = '';
		}

		while(currentPage.firstChild) {
			currentPage.removeChild(currentPage.firstChild);
		}
		currentPage.appendChild(document.createTextNode(view.currentPage));

		while(lastPage.firstChild) {
			lastPage.removeChild(lastPage.firstChild);
		}
		var pageTotal = Math.ceil(view.totalStreams / view.limit).toString();
		lastPage.appendChild(document.createTextNode(pageTotal));
	}

	/**
	 * Notify the user
	 */
	function notifyUser() {
		var notificationEl = document.createElement('div');
		var notificationMsg = document.createElement('p');
		var link = document.createElement('span');
		var message = document.createTextNode('Looks like there is an error from Twitch. If you would like to try again click the link below.');
		var retry = document.createTextNode('Retry');

		notificationEl.setAttribute('class', 'alert');
		link.setAttribute('class', 'retry');

		link.addEventListener('click', function() {
			getStreams('retry');
		});

		link.appendChild(retry);
		notificationMsg.appendChild(message);
		notificationEl.appendChild(notificationMsg);
		notificationEl.appendChild(link);

		streamList.parentNode.insertBefore(notificationEl, streamList);
	}

});