-- Seed initial templates for all categories
-- Run this after the schema.sql

-- Gaming Templates
INSERT INTO public.templates (name, category, type, thumbnail_url, canvas_state, is_premium) VALUES
(
  'Epic Gaming Moment',
  'gaming',
  'full_design',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "bg-1",
        "type": "image",
        "x": 0,
        "y": 0,
        "width": 1280,
        "height": 720,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 0,
        "visible": true,
        "locked": true,
        "name": "Background",
        "src": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1280&h=720&fit=crop"
      },
      {
        "id": "text-1",
        "type": "text",
        "x": 640,
        "y": 200,
        "width": 1000,
        "height": 150,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Title",
        "text": "EPIC WIN",
        "fontSize": 120,
        "fontFamily": "Bangers",
        "fontStyle": "bold",
        "fill": "#FFD700",
        "stroke": "#000000",
        "strokeWidth": 6,
        "align": "center",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
),
(
  'Gaming Neon Layout',
  'gaming',
  'layout_only',
  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 100,
        "y": 150,
        "width": 600,
        "height": 120,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Main Title",
        "text": "YOUR TITLE",
        "fontSize": 96,
        "fontFamily": "Oswald",
        "fontStyle": "bold",
        "fill": "#00FFFF",
        "stroke": "#FF00FF",
        "strokeWidth": 4,
        "align": "left",
        "verticalAlign": "middle"
      },
      {
        "id": "text-2",
        "type": "text",
        "x": 100,
        "y": 280,
        "width": 500,
        "height": 60,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 0.9,
        "zIndex": 2,
        "visible": true,
        "locked": false,
        "name": "Subtitle",
        "text": "Subtitle goes here",
        "fontSize": 36,
        "fontFamily": "Oswald",
        "fontStyle": "normal",
        "fill": "#FFFFFF",
        "align": "left",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
);

-- Vlog Templates
INSERT INTO public.templates (name, category, type, thumbnail_url, canvas_state, is_premium) VALUES
(
  'Lifestyle Vlog',
  'vlog',
  'full_design',
  'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 640,
        "y": 360,
        "width": 1000,
        "height": 100,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Title",
        "text": "MY DAY IN...",
        "fontSize": 72,
        "fontFamily": "Poppins",
        "fontStyle": "bold",
        "fill": "#FFFFFF",
        "stroke": "#000000",
        "strokeWidth": 3,
        "align": "center",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
),
(
  'Clean Vlog Layout',
  'vlog',
  'layout_only',
  'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 640,
        "y": 580,
        "width": 1100,
        "height": 80,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Title",
        "text": "ADD YOUR TITLE HERE",
        "fontSize": 56,
        "fontFamily": "Montserrat",
        "fontStyle": "bold",
        "fill": "#FFFFFF",
        "stroke": "#000000",
        "strokeWidth": 2,
        "align": "center",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
);

-- Tutorial Templates
INSERT INTO public.templates (name, category, type, thumbnail_url, canvas_state, is_premium) VALUES
(
  'How-To Tutorial',
  'tutorial',
  'full_design',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 640,
        "y": 200,
        "width": 1000,
        "height": 100,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "How To",
        "text": "HOW TO",
        "fontSize": 48,
        "fontFamily": "Inter",
        "fontStyle": "normal",
        "fill": "#8B5CF6",
        "align": "center",
        "verticalAlign": "middle"
      },
      {
        "id": "text-2",
        "type": "text",
        "x": 640,
        "y": 320,
        "width": 1000,
        "height": 120,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 2,
        "visible": true,
        "locked": false,
        "name": "Title",
        "text": "YOUR TOPIC",
        "fontSize": 96,
        "fontFamily": "Inter",
        "fontStyle": "bold",
        "fill": "#FFFFFF",
        "stroke": "#000000",
        "strokeWidth": 3,
        "align": "center",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
),
(
  'Step by Step',
  'tutorial',
  'layout_only',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 100,
        "y": 100,
        "width": 150,
        "height": 150,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Step Number",
        "text": "01",
        "fontSize": 120,
        "fontFamily": "Bebas Neue",
        "fontStyle": "bold",
        "fill": "#F97316",
        "align": "center",
        "verticalAlign": "middle"
      },
      {
        "id": "text-2",
        "type": "text",
        "x": 300,
        "y": 130,
        "width": 800,
        "height": 100,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 2,
        "visible": true,
        "locked": false,
        "name": "Title",
        "text": "STEP TITLE",
        "fontSize": 72,
        "fontFamily": "Inter",
        "fontStyle": "bold",
        "fill": "#FFFFFF",
        "align": "left",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
);

-- Podcast Templates
INSERT INTO public.templates (name, category, type, thumbnail_url, canvas_state, is_premium) VALUES
(
  'Podcast Episode',
  'podcast',
  'full_design',
  'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 640,
        "y": 150,
        "width": 800,
        "height": 60,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 0.9,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Episode",
        "text": "EPISODE 01",
        "fontSize": 36,
        "fontFamily": "Inter",
        "fontStyle": "normal",
        "fill": "#A855F7",
        "align": "center",
        "verticalAlign": "middle"
      },
      {
        "id": "text-2",
        "type": "text",
        "x": 640,
        "y": 280,
        "width": 1000,
        "height": 120,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 2,
        "visible": true,
        "locked": false,
        "name": "Title",
        "text": "PODCAST TITLE",
        "fontSize": 72,
        "fontFamily": "Montserrat",
        "fontStyle": "bold",
        "fill": "#FFFFFF",
        "align": "center",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
);

-- Reaction Templates
INSERT INTO public.templates (name, category, type, thumbnail_url, canvas_state, is_premium) VALUES
(
  'Reaction Face',
  'reaction',
  'full_design',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 200,
        "y": 200,
        "width": 500,
        "height": 150,
        "rotation": -5,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Reaction",
        "text": "WHAT?!",
        "fontSize": 120,
        "fontFamily": "Bangers",
        "fontStyle": "bold",
        "fill": "#FF0000",
        "stroke": "#FFFFFF",
        "strokeWidth": 6,
        "align": "center",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
),
(
  'Commentary Style',
  'reaction',
  'layout_only',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 640,
        "y": 600,
        "width": 1100,
        "height": 80,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Comment",
        "text": "YOUR REACTION HERE",
        "fontSize": 56,
        "fontFamily": "Anton",
        "fontStyle": "bold",
        "fill": "#FFDD00",
        "stroke": "#000000",
        "strokeWidth": 4,
        "align": "center",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
);

-- Business Templates
INSERT INTO public.templates (name, category, type, thumbnail_url, canvas_state, is_premium) VALUES
(
  'Professional Business',
  'business',
  'full_design',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 640,
        "y": 280,
        "width": 1000,
        "height": 100,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Title",
        "text": "BUSINESS STRATEGY",
        "fontSize": 72,
        "fontFamily": "Inter",
        "fontStyle": "bold",
        "fill": "#FFFFFF",
        "align": "center",
        "verticalAlign": "middle"
      },
      {
        "id": "text-2",
        "type": "text",
        "x": 640,
        "y": 400,
        "width": 800,
        "height": 50,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 0.9,
        "zIndex": 2,
        "visible": true,
        "locked": false,
        "name": "Subtitle",
        "text": "5 Tips for Success",
        "fontSize": 32,
        "fontFamily": "Inter",
        "fontStyle": "normal",
        "fill": "#60A5FA",
        "align": "center",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
),
(
  'Marketing Layout',
  'business',
  'layout_only',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&h=720&fit=crop',
  '{
    "width": 1280,
    "height": 720,
    "layers": [
      {
        "id": "text-1",
        "type": "text",
        "x": 100,
        "y": 300,
        "width": 600,
        "height": 120,
        "rotation": 0,
        "scaleX": 1,
        "scaleY": 1,
        "opacity": 1,
        "zIndex": 1,
        "visible": true,
        "locked": false,
        "name": "Title",
        "text": "YOUR TITLE",
        "fontSize": 84,
        "fontFamily": "Montserrat",
        "fontStyle": "bold",
        "fill": "#1E40AF",
        "align": "left",
        "verticalAlign": "middle"
      }
    ]
  }',
  false
);

