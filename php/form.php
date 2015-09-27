<?php
require_once("class.Database.inc");

saveToDb($_POST);

function saveToDb($rsvp) {
    $name = $rsvp['name'];
    $adults = $rsvp['adults'];
    $kids = $rsvp['kids'];
    $vegan = $rsvp['vegan'];
    $vegetarian = $rsvp['vegetarian'];
    $veganNum = isset($rsvp['vegan_num']) ? $rsvp['vegan_num'] : 0;
    $veganText = $rsvp['vegan_text'] === "" ? "no" : $rsvp['vegan_text'];

    $db = Database::getInstance();
    $dbh = $db->getConnection();

    $stmt = $dbh->prepare("INSERT INTO rsvp (name, adults, kids, vegan, vegetarian, vegan_num, vegan_text) VALUES (:name, :adults, :kids, :vegan, :vegetarian, :vegan_num, :vegan_text)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':adults', $adults);
    $stmt->bindParam(':kids', $kids);
    $stmt->bindParam(':vegan', $vegan);
    $stmt->bindParam(':vegetarian', $vegetarian);
    $stmt->bindParam(':vegan_num', $veganNum);
    $stmt->bindParam(':vegan_text', $veganText);

    $stmt->execute();
}

function checkIfNameExist($name) {
    $query = "SELECT 1 FROM rsvp where name = :name";

    $db = Database::getInstance();
    $dbh = $db->getConnection();

    $stmt = $dbh->prepare($query);
    $stmt->bindParam(':name', $name);

    $result = $stmt->execute();
    return $result;
}
