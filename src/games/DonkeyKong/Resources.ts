
type ResourceKey = "background" | "mario" | "barrel" | "hammer" | "kong" | "fireball";

interface ImageResource {
image: HTMLImageElement;
isLoaded: boolean;
}

class Resources {
    private toLoad: Record<ResourceKey, string>;
    public images: Record<ResourceKey, ImageResource>;

    constructor() {
        this.toLoad = {
            background: "/sprites/bg.png",
            mario: "/sprites/mario.png",
            barrel: "/sprites/barrel2.png",
            hammer: '/sprites/hammer.png',
            kong: '/sprites/kong.png',
            fireball: '/sprites/fireball.png'
        };

        this.images = {} as Record<ResourceKey, ImageResource>;

        (Object.keys(this.toLoad) as ResourceKey[]).forEach((key) => {
            const img = new Image();
            img.src = this.toLoad[key]
            this.images[key] = {
                image: img,
                isLoaded: false
            };

            img.onload = () => {
                this.images[key].isLoaded = true;
            };
        });
    }
}

export const resources = new Resources()