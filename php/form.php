<?php
require_once("class.Database.inc");


if (!checkIfNameExist($_POST) || strcmp($_POST['action'], 'overwrite') === 0) {
    saveToDb($_POST);
} else {
    echo json_encode(array("exist" => true, "name" => $_POST['name']));
}

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
//    $query = 'UPDATE  `lets_do_it_db1`.`groups` SET  `activity_id` = '.$minMaxItemId. ' WHERE  `groups`.`id` = '.$group->id;
    if ($rsvp['action'] === "save")
        $stmt = $dbh->prepare("INSERT INTO rsvp (name, adults, kids, vegan, vegetarian, vegan_num, vegan_text) VALUES (:name, :adults, :kids, :vegan, :vegetarian, :vegan_num, :vegan_text)");
    else
        $stmt = $dbh->prepare("UPDATE rsvp SET adults = :adults, kids = :kids, vegan = :vegan, vegetarian = :vegetarian, vegan_num = :vegan_num, vegan_text = :vegan_text where name = :name");

    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':adults', $adults);
    $stmt->bindParam(':kids', $kids);
    $stmt->bindParam(':vegan', $vegan);
    $stmt->bindParam(':vegetarian', $vegetarian);
    $stmt->bindParam(':vegan_num', $veganNum);
    $stmt->bindParam(':vegan_text', $veganText);

    $stmt->execute();
    echo json_encode(array("exist" => false, "name"=> $name, "success" => true));
}

function checkIfNameExist($rsvp) {
    $query = "SELECT 1 FROM rsvp where name = ?";

    $db = Database::getInstance();
    $dbh = $db->getConnection();

    $stmt = $dbh->prepare($query);
    $stmt->bindParam(1, $rsvp['name'], PDO::PARAM_STR, 12);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    return (bool)$row;
}
