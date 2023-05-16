"use strict";
(function() {

  const WPL_API_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/wpl/wpl.php";

  window.addEventListener("load", init);

  /**
   * Override the default submission behavior for the form's submit event.
   */
  function init() {
    id("input-form").addEventListener("submit", function(e) {
      e.preventDefault();
      submitRequest();
    });
    id("log-queue").addEventListener("click", logQueue);
  }

  /**
   * Send form data to the WPL web service. Note that this function is called only
   * after all HTML5 validation constraints (e.g. required attributes) have passed!
   */
  function submitRequest() {
    const url = WPL_API_URL;
    const params = new FormData(id("input-form"));

    fetch(url, { method: "POST", body: params })
      .then(statusCheck)
      .then(resp => resp.json())
      .then(showResponse)
      .catch(handleError);
  }

  // Show the response in a more user-friendly manner
  function showResponse(response) {
    const resultsContainer = id("results");
    resultsContainer.innerHTML = "";

    for (const key in response) {
      if (response.hasOwnProperty(key)) {
        const value = response[key];
        const resultItem = document.createElement("div");
        resultItem.textContent = `${key}: ${value}`;
        resultsContainer.appendChild(resultItem);
      }
    }
  }

  // Handle the error in a more user-friendly manner
  function handleError(error) {
    const errorContainer = id("error");
    errorContainer.textContent = error.message;
  }

  function logQueue() {
    fetch(WPL_API_URL + "?mode=list")
      .then(statusCheck)
      .then(resp => resp.json())
      .then(showQueue)
      .catch(handleError);
  }

  // Display the queue in a more user-friendly manner
  function showQueue(queue) {
    const queueContainer = id("queue");
    queueContainer.innerHTML = "";

    if (queue.length === 0) {
      const noItemsMessage = document.createElement("p");
      noItemsMessage.textContent = "Queue is empty.";
      queueContainer.appendChild(noItemsMessage);
    } else {
      const queueList = document.createElement("ul");

      for (const item of queue) {
        const queueItem = document.createElement("li");
        queueItem.textContent = item;
        queueList.appendChild(queueItem);
      }

      queueContainer.appendChild(queueList);
    }
  }

  /* ------------------------------ Helper Functions  ------------------------------ */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} query - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(query) {
    return document.querySelector(query);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * This function checks the status of the response and throws an error if it's not okay.
   * @returns {} response
   */
  async function status
