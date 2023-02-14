import "./style.css";
import 'flowbite';
import Alpine from 'alpinejs'
import collapse from '@alpinejs/collapse'
import mask from '@alpinejs/mask'
import focus from '@alpinejs/focus'

Alpine.plugin(collapse)
Alpine.plugin(mask)
Alpine.plugin(focus)

window.Alpine = Alpine

window.onload = (event) => {
	Alpine.start()
}