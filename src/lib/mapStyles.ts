/*
 * Der Kartenstil, nachgeladen statt mitgebündelt.
 *
 * Jede Ansicht mit Leaflet importiert dieses Modul. Der Bundler legt daraus
 * eine eigene CSS-Datei an, die mit der ersten Kartenansicht kommt – und
 * nicht mit der Startseite, die keine Karte zeigt.
 */
import '../map.css';
