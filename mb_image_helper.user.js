// ==UserScript==
// @name         MusicBrainz Image Helper
// @namespace    https://github.com/mistwyrm/MusicBrainzScripts
// @version      2025-05-10
// @description  Quickly add archived image links to an artist's profile.
// @author       mistwyrm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musicbrainz.org
// @downloadURL  https://raw.githubusercontent.com/mistwyrm/MusicBrainzScripts/main/mb_image_helper.user.js
// @updateURL    https://raw.githubusercontent.com/mistwyrm/MusicBrainzScripts/main/mb_image_helper.user.js
// @match        *://sambl.lioncat6.com/artist*
// @grant        none
// ==/UserScript==

(function() {
    var imageElementsAvailable = function(callback) {
        if (document.getElementById("mbURL") && document.getElementById("artistImageContainer").querySelector("a")) {
            callback();
        } else {
            setTimeout(function() {
                imageElementsAvailable(callback);
            }, 100);
        }
    };

    imageElementsAvailable(function() {
        var imageElement = document.getElementById("artistImageContainer").querySelector("a");
        var imageURL = imageElement.href;
        var mbId = document.getElementById("mbURL").href;
        imageElement.href = mbId + "/edit?edit-artist.url.0.text=https://web.archive.org/web/0/" + imageURL + "&edit-artist.url.0.link_type_id=173&edit-artist.edit_note=Image URL imported from Spotify/SAMBL using mistwyrm's Artist Image Helper userscript https://github.com/mistwyrm/MusicBrainzScripts";
    });
})();
