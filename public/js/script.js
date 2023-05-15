function showProfile(button) {
    // Find the parent list-item1 element
    const listItem = button.closest('.list-item1');
  
    // Find the friend-name element within the parent
    const friendNameElement = listItem.querySelector('.friend-name');
  
    // Get the friendUsername from the friend-name element
    const friendUsername = friendNameElement.textContent;
  
    console.log('Clicked user:', friendUsername);
    // Your code to handle the user's profile goes here
  }

