$(document).ready(() => {
  getEvents();
});

getEvents = () => {
  fetch('/api/v1/events', {
    method: 'GET'
  }).then((response) => {
    return response.json()
  }).then((json) => {
    const items = json.forEach(item => {
      appendEvent(item.title, item.description, item.start, item.end)
  }).catch((error) => {
    error: 'cannot getEvents'
  });
};

postItem = (title, description, start, end) => {
  fetch('/api/v1/events', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body:
      JSON.stringify({ 'title': title, 'description': description, 'start': start, 'end': end })
  }).then((response) => {
    return response.json()
  }).then((json) => {
    appendEvent(json.title, json.description, json.start, json.end, json.id);
  }).catch((error) => {
    error: 'cannot add that event';
  });
};

appendEvent = (title, description, start, end, id) => {
  const $itemCard = $('ul');
  $itemCard.prepend(
    `<li data-id='${id}' class='garage-list-item ${start}'>${title}</li>`
  );
};

appendOneItem = (title, description, start) => {
  const $itemInfo = $('.item-info');
  $($itemInfo).empty().append(
    `<h2>${title}</h2>
    <h4>Reason for having: ${description}</h4>
    <select id="dropdown-solo form-field" placeholder="Cleanliness Level">
      <option class="start" value="" disabled selected>${start}</option>
      <option class='drop' value='sparkling'>Sparkling</option>
      <option class='drop' value='dusty'>Dusty</option>
      <option class='drop' value='rancid'>Rancid</option>
    </select>`
  );
};

$('.submit').on('click', (e) => {
  e.preventDefault();
  let $title = $('.title').val();
  let $description = $('.description').val();
  let $start = $('.dropdown-form').val();
  let $end = $('.dropdown-form').val();

  clearFields();
  postItem($title, $description, $start);
});

$('ul').on('click', 'li', (e) => {
  const id = e.target.dataset.id;
  grabItem(id);
});

clearFields = () => {
 $('.title').val('');
 $('.description').val('');
 
 $('.dropdown-form').val('');
};
