<?php
namespace App\Model;

use App\Service\Config;

class Image
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $imageLink = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Image
    {
        $this->id = $id;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Image
    {
        $this->title = $title;

        return $this;
    }

    public function getImageLink(): ?string
    {
        return $this->imageLink;
    }

    public function setImageLink(?string $imageLink): Image
    {
        $this->imageLink = $imageLink;

        return $this;
    }

    public static function fromArray($array): Image
    {
        $image = new self();
        $image->fill($array);

        return $image;
    }

    public function fill($array): Image
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['image_link'])) {
            $this->setImageLink($array['image_link']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM image';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $images = [];
        $imagesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($imagesArray as $imageArray) {
            $images[] = self::fromArray($imageArray);
        }

        return $images;
    }

    public static function find($id): ?Image
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM image WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $imageArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $imageArray) {
            return null;
        }
        $image = Image::fromArray($imageArray);

        return $image;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO image (title, image_link) VALUES (:title, :image_link)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'image_link' => $this->getImageLink(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE image SET title = :title, image_link = :image_link WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':image_link' => $this->getImageLink(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM image WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setImageLink(null);
    }
}
