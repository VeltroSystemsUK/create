#!/usr/bin/env python3
"""Create icon.png from SVG favicon"""

try:
    from PIL import Image, ImageDraw
    import os

    # Create a 256x256 image with dark background
    img = Image.new('RGB', (256, 256), color=(0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Neon green color (#CDFE00)
    green = (205, 254, 0)

    # Draw 4 squares (8x8 in SVG = 64x64 in 256x256)
    square_size = 64
    gap = 32

    # Top-left
    draw.rectangle([gap, gap, gap + square_size, gap + square_size], fill=green)

    # Top-right
    draw.rectangle([gap + 128, gap, gap + 128 + square_size, gap + square_size], fill=green)

    # Bottom-left
    draw.rectangle([gap, gap + 128, gap + square_size, gap + 128 + square_size], fill=green)

    # Bottom-right
    draw.rectangle([gap + 128, gap + 128, gap + 128 + square_size, gap + 128 + square_size], fill=green)

    # Save
    assets_dir = os.path.join(os.path.dirname(__file__), 'assets')
    os.makedirs(assets_dir, exist_ok=True)

    png_path = os.path.join(assets_dir, 'icon.png')
    img.save(png_path)
    print(f'✓ Icon created at: {png_path}')

except ImportError:
    print('PIL not available. Creating icon manually...')
    import struct
    import zlib

    # Minimal PNG with neon green squares
    # This creates a 256x256 PNG manually
    width = 256
    height = 256

    # PNG header
    png_header = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk (image header)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)  # 8-bit RGB
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)

    # Create pixel data
    pixels = bytearray()
    for y in range(height):
        pixels.append(0)  # filter type for this scanline
        for x in range(width):
            # Check if we're in one of the 4 green squares
            in_square = False

            # Top-left (32-96, 32-96)
            if 32 <= x < 96 and 32 <= y < 96:
                in_square = True
            # Top-right (160-224, 32-96)
            elif 160 <= x < 224 and 32 <= y < 96:
                in_square = True
            # Bottom-left (32-96, 160-224)
            elif 32 <= x < 96 and 160 <= y < 224:
                in_square = True
            # Bottom-right (160-224, 160-224)
            elif 160 <= x < 224 and 160 <= y < 224:
                in_square = True

            if in_square:
                pixels.extend([205, 254, 0])  # Neon green
            else:
                pixels.extend([0, 0, 0])  # Black

    # Compress pixel data
    compressed = zlib.compress(bytes(pixels))
    idat_crc = zlib.crc32(b'IDAT' + compressed) & 0xffffffff
    idat_chunk = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + struct.pack('>I', idat_crc)

    # IEND chunk (image end)
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)

    # Combine all chunks
    png_data = png_header + ihdr_chunk + idat_chunk + iend_chunk

    # Save
    import os
    assets_dir = os.path.join(os.path.dirname(__file__), 'assets')
    os.makedirs(assets_dir, exist_ok=True)

    png_path = os.path.join(assets_dir, 'icon.png')
    with open(png_path, 'wb') as f:
        f.write(png_data)
    print(f'✓ Icon created at: {png_path}')
