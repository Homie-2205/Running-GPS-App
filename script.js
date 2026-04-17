  <script>
    function greetUser() {
      // 1. Get the value from the input field
      const name = document.getElementById("userName").value;

      // 2. Check if the input is not empty
      if (name.trim() !== "") {
        // 3. Display the greeting in the paragraph tag
        document.getElementById("greetingOutput").innerText = "Hola como estas, " + name + "!";
      } else {
        document.getElementById("greetingOutput").innerText = "Please enter a name.";
      }
    }
  </script>
