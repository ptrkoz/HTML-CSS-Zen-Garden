<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Image;
use App\Service\Router;
use App\Service\Templating;

class ImageController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $images = Image::findAll();
        $html = $templating->render('image/index.html.php', [
            'images' => $images,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestImage, Templating $templating, Router $router): ?string
    {
        if ($requestImage) {
            $image = Image::fromArray($requestImage);
            $image->save();

            $path = $router->generatePath('image-index');
            $router->redirect($path);
            return null;
        } else {
            $image = new Image();
        }

        $html = $templating->render('image/create.html.php', [
            'image' => $image,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $imageId, ?array $requestImage, Templating $templating, Router $router): ?string
    {
        $image = Image::find($imageId);
        if (! $image) {
            throw new NotFoundException("Missing image with id $imageId");
        }

        if ($requestImage) {
            $image->fill($requestImage);
            $image->save();

            $path = $router->generatePath('image-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('image/edit.html.php', [
            'image' => $image,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $imageId, Templating $templating, Router $router): ?string
    {
        $image = Image::find($imageId);
        if (! $image) {
            throw new NotFoundException("Missing image with id $imageId");
        }

        $html = $templating->render('image/show.html.php', [
            'image' => $image,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $imageId, Router $router): ?string
    {
        $image = Image::find($imageId);
        if (! $image) {
            throw new NotFoundException("Missing image with id $imageId");
        }

        $image->delete();
        $path = $router->generatePath('image-index');
        $router->redirect($path);
        return null;
    }
}
