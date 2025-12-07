<?php

/** @var \App\Model\Image $image */
/** @var \App\Service\Router $router */

$title = 'Create Image';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Image</h1>
    <form action="<?= $router->generatePath('image-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="image-create">
    </form>

    <a href="<?= $router->generatePath('image-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
