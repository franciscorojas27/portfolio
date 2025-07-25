(function () {
  let scale = 1;
  let origin = { x: 0, y: 0 };
  let last = { x: 0, y: 0 };
  let dragging = false;
  const minScale = 1;
  const maxScale = 4;

  function resetImgTransform(img: HTMLImageElement) {
    scale = 1;
    img.style.transform = "";
    img.dataset.x = "0";
    img.dataset.y = "0";
  }

  function setImgTransform(img: HTMLImageElement, scale: number, dx = 0, dy = 0) {
    img.style.transform = scale > 1
      ? `scale(${scale}) translate(${dx}px,${dy}px)`
      : "";
  }

  (window as any).showProjectImgModal = (src: string, alt: string) => {
    const modal = document.getElementById("project-img-modal") as HTMLElement | null;
    const img = document.getElementById("project-img-modal-img") as HTMLImageElement | null;
    if (!modal || !img) return;

    // Show modal and set image
    modal.classList.remove("hidden");
    modal.classList.add('flex')
    img.src = src;
    img.alt = alt;
    document.body.style.overflow = "hidden";
    resetImgTransform(img);
    img.style.cursor = "zoom-in";

    // Zoom with mouse wheel
    img.onwheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      scale = Math.min(maxScale, Math.max(minScale, scale + delta));
      setImgTransform(img, scale, Number(img.dataset.x) || 0, Number(img.dataset.y) || 0);
      img.style.cursor = scale > 1 ? "grab" : "zoom-in";
    };

    // Start dragging
    img.onmousedown = (e) => {
      if (scale === 1) return;
      dragging = true;
      origin = { x: e.clientX, y: e.clientY };
      last = {
        x: parseFloat(img.dataset.x || "0"),
        y: parseFloat(img.dataset.y || "0"),
      };
      img.style.cursor = "grabbing";
    };

    // Drag image
    img.onmousemove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - origin.x + last.x;
      const dy = e.clientY - origin.y + last.y;
      setImgTransform(img, scale, dx, dy);
      img.dataset.x = dx.toString();
      img.dataset.y = dy.toString();
    };

    // Stop dragging
    img.onmouseup = img.onmouseleave = () => {
      dragging = false;
      img.style.cursor = scale > 1 ? "grab" : "zoom-in";
    };

    // Double click to reset zoom/pan
    img.ondblclick = () => resetImgTransform(img);
  };

  (window as any).hideProjectImgModal = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.id === "project-img-modal" ||
      target.id === "close-project-img-modal"
    ) {
      const modal = document.getElementById("project-img-modal") as HTMLElement | null;
      const img = document.getElementById("project-img-modal-img") as HTMLImageElement | null;
      if (!modal || !img) return;
      modal.classList.add("hidden");
      modal.classList.remove("flex")
      document.body.style.overflow = "";
      resetImgTransform(img);
    }
  };
})();
