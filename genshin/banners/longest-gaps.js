﻿// Function to convert character name to snake_case
function toSnakeCase(name) {
	return name.toLowerCase().replace(/ /g, '_');
}

// Function to create and return an element with given type, class, and text content
function createElement(type, className, textContent = '', innerHTML = '') {
	const element = document.createElement(type);
	if (className) element.classList.add(className);
	if (textContent) element.textContent = textContent;
	if (innerHTML) element.innerHTML = innerHTML;
	return element;
}


// Function to calculate the gap between two dates
function calculateGap(startDate, endDate) {
	const start = new Date(startDate);
	const end = new Date(endDate);
	return Math.abs(start - end) / (1000 * 60 * 60 * 24); // Gap in days
}

// Function to find the 3 longest gaps without a banner
function findLongestGaps(data) {
	const excludedCharacters = new Set([
		"Keqing", "Tighnari", "Dehya", "Amber", "Kaeya",
		"Lisa", "Jean", "Diluc", "Mona"
	]);

	const gaps = [];

	data.characters
		.filter(character => !excludedCharacters.has(character.name))
		.forEach(character => {
		const reruns = character.reruns;

		// Sort reruns by startDate to ensure chronological order
		reruns.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

		// Calculate gaps between consecutive banners
		for (let i = 0; i < reruns.length - 1; i++) {
			const currentEnd = reruns[i].endDate;
			const nextStart = reruns[i + 1].startDate;
			const gap = calculateGap(nextStart, currentEnd);
			gaps.push({
				character: character.name,
				gap,
				start: currentEnd,
				end: nextStart
			});
		}

		// Calculate the gap between the last banner and the current date
		if (reruns.length > 0) {
			const mostRecentEnd = reruns[reruns.length - 1].endDate;
			const currentDate = new Date().toISOString().split('T')[0];
			const gap = calculateGap(currentDate, mostRecentEnd);
			gaps.push({
				character: character.name,
				gap,
				start: mostRecentEnd,
				end: "Ongoing"
			});
		}
	});

	// Sort gaps in descending order and get the top 3
	gaps.sort((a, b) => b.gap - a.gap);
	return gaps.slice(0, 10);
}

function checkJsonData() {
	fetch('rerun_data.json')
		.then(response => response.json())
		.then(data => {
			const longestGaps = findLongestGaps(data);
			displayLongestGaps(longestGaps);
		})
		.catch(error => console.error('Error fetching rerun data:', error));
}

// Function to display the longest gaps on the page
function displayLongestGaps(gaps) {
	const container = document.getElementById('longest-gaps');
	container.innerHTML = '';

	gaps.forEach((gap, index) => {
		const gapElement = createElement('div', 'gap-item');
		const snakeCaseName = gap.character.toLowerCase().replace(/\s+/g, '_');

		const img = createElement('img', 'character-image');
		img.src = `https://game-cdn.appsample.com/gim/avatars/${snakeCaseName}.png`;
		img.alt = `${gap.character} avatar`;
		img.title = `${gap.character}`;

		const info = createElement('div', 'gap-info', '', `
			<div class="character-name">${gap.character}</div>
			<p><strong>Gap Length:</strong> ${gap.gap} days</p>
			<p><strong>Gap Start:</strong> ${gap.start}</p>
			<p><strong>Gap End:</strong> ${gap.end}</p>`);

		gapElement.appendChild(img);
		gapElement.appendChild(info);
		container.appendChild(gapElement);
	});
}


checkJsonData()