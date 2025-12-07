<?php

/** @var \App\Model\Image[] $images */
/** @var \App\Service\Router $router */

$title = 'Image List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Images List</h1>

    <a href="<?= $router->generatePath('image-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($images as $image): ?>
            <li>

                <h3><?= $image->getTitle() ?></h3>
                <img src="<?= $image->getImageLink();?>" width="200px" />
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('image-show', ['id' => $image->getId()]) ?>">View full size</a></li>
                    <li><a href="<?= $router->generatePath('image-edit', ['id' => $image->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
