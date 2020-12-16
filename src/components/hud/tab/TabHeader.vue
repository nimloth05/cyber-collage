<template>
  <ul class="hud-tab-list">
    <li>
<!--      <img src="" alt="Play-Knopf" title="Spielen"/>-->
      Play
    </li>
    <li>
<!--      <img src="" alt="Welt designen" title="Designen"/>-->
      Design
    </li>
    <li>
<!--      <img src="" alt="Programmieren" title="Programmieren"/>-->
      Rules
    </li>
  </ul>
</template>

<style>
.hud-tab-list {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

.hud-tab-list li {
  padding: 0.5em;
  text-align: center;
  height: 2em;
  background: #b5b5b5;
  position: relative;
}

.hud-tab-list li:before {
  content: '';
  position: absolute;
  top: 0; right: 0;
  border-top: 5px solid #b5b5b5; /* white */
  border-left: 5px solid #b5b5b5;
  width: 0;
}

.hud-tab-list li:after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  border-top: 5px solid #b5b5b5; /* white */
  border-right: 5px solid #b5b5b5;
  width: 0;
}

.hud-tab-list li:hover {
  background-color: gray;
}

.hud-tab-list li:hover:before {
  border-top-color: #b5b5b5; /* white */
  border-left-color: gray;
}

.hud-tab-list li:hover:after {
  border-top-color: #b5b5b5; /* white */
  border-right-color: gray;
}

</style>
