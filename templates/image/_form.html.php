<?php
    /** @var $image ?\App\Model\Image */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="image[title]" value="<?= $image ? $image->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="imageLink">Image link</label>
    <textarea id="imageLink" name="image[image_link]"><?= $image? $image->getImageLink() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
