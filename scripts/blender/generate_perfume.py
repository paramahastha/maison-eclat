"""Original Maison Éclat bottle. Blender 4.2+/5.2. No external assets.
Run: blender --background --python scripts/blender/generate_perfume.py
Use -- --geometry-only to skip Cycles posters. All paths are repo-relative.
"""
import bpy, math, os, sys
from mathutils import Vector
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
OUT = os.path.join(ROOT, 'public')
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
scene.render.engine='CYCLES'
scene.cycles.samples=48
scene.cycles.use_denoising=True
scene.cycles.max_bounces=10
scene.cycles.transmission_bounces=8
scene.render.resolution_x=1000; scene.render.resolution_y=1200; scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'; scene.render.image_settings.color_mode='RGBA'
scene.render.film_transparent=True
scene.world.color=(.23,.23,.23)
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'

def material(name,color,metal=0,rough=.2,trans=0):
    m=bpy.data.materials.new(name); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
    p.inputs['Transmission Weight'].default_value=trans;p.inputs['IOR'].default_value=1.45
    return m

def box(name,loc,dimensions,mat,bevel=.08):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc)
    o=bpy.context.object;o.name=name;o.dimensions=dimensions
    bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    if bevel:
        b=o.modifiers.new('Soft sculpted edges','BEVEL');b.width=bevel;b.segments=6
        bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=b.name)
    for p in o.data.polygons:p.use_smooth=True
    n=o.modifiers.new('Weighted studio normals','WEIGHTED_NORMAL');n.keep_sharp=True
    bpy.ops.object.modifier_apply(modifier=n.name)
    if mat:o.data.materials.append(mat)
    return o

glass=material('Glass',(0.9,.94,.82),rough=.07,trans=1)
liquid=material('Liquid',(.35,.21,.07),rough=.08,trans=.76)
capmat=material('Cap',(.045,.055,.037),metal=.76,rough=.28)
brass=material('Collar',(.44,.31,.13),metal=.85,rough=.24)
base=material('Base',(.74,.77,.58),rough=.1,trans=.92)
body=box('Bottle_Glass',(0,0,1.55),(1.66,.83,2.65),glass,.14)
cavity=box('Cavity',(0,0,1.6),(1.48,.65,2.40),None,.11)
b=bpy.context.view_layer.objects.active=body
boolean=body.modifiers.new('Real hollow glass','BOOLEAN');boolean.operation='DIFFERENCE';boolean.object=cavity
bpy.ops.object.modifier_apply(modifier=boolean.name);bpy.data.objects.remove(cavity,do_unlink=True)
fluid=box('Bottle_Liquid',(0,0,1.49),(1.43,.60,2.12),liquid,.10)
foot=box('Bottle_Base',(0,0,.305),(1.46,.65,.17),base,.07)
collar=box('Bottle_Collar',(0,0,2.94),(.64,.54,.18),brass,.045)
cap=box('Bottle_Cap',(0,0,3.29),(1.02,.80,.57),capmat,.075)
seam=box('Cap_Seam',(0,-.003,3.025),(.97,.78,.016),brass,.006)
# Fine groove geometry is original, deliberately sparse for a small export.
for i in range(9):
    box('Cap_Brush_%02d'%i,(0,-.401,3.08+i*.046),(.84,.002,.002),brass,.0005)
labelmat=material('Label',(.84,.78,.65),rough=.7)
p=labelmat.node_tree.nodes.get('Principled BSDF')
tex=labelmat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(os.path.join(OUT,'textures/label-obsidian.png'));labelmat.node_tree.links.new(tex.outputs['Color'],p.inputs['Base Color'])
bpy.ops.mesh.primitive_plane_add(size=1,location=(0,-.421,1.50),rotation=(math.pi/2,0,0))
label=bpy.context.object;label.name='Bottle_Label';label.scale=(1.03,1.16,1);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);label.data.materials.append(labelmat)
# Export the bottle alone, centered vertically, in glTF's Y-up coordinates.
meshes=[o for o in scene.objects if o.type=='MESH']
for o in meshes:o.location.z-=1.86
bpy.ops.object.select_all(action='DESELECT')
for o in meshes:o.select_set(True)
os.makedirs(os.path.join(OUT,'models'),exist_ok=True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'models/maison-bottle.glb'),export_format='GLB',use_selection=True,export_apply=True)
for o in meshes:o.location.z+=1.86
# Studio lights, large enough to trace the glass rather than blow out its highlights.
def area(name,loc,power,color,size,target=(0,0,1.7),scale=None):
    bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.color=color;o.data.shape='RECTANGLE';o.data.size=size;o.data.size_y=size*2.5 if scale is None else scale
    o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
area('Ivory softbox',(-3,-4,5),650,(1,.90,.74),3)
area('Long rim',(3,1.5,3.8),900,(1,.80,.50),1.4,scale=5)
area('Front label',(1,-5,3),160,(1,.98,.92),3)
area('Cool edge',(-2.5,1,2),750,(.7,.79,.69),1,scale=4)
bpy.ops.object.camera_add(location=(4.1,-10.8,4.7));camera=bpy.context.object;camera.rotation_euler=(Vector((0,0,1.85))-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=4.35;scene.camera=camera
variants=[('obsidian',(.35,.21,.07),(.045,.055,.037)),('neroli',(.64,.46,.13),(.44,.37,.23)),('santal',(.41,.18,.07),(.19,.11,.05))]
if '--geometry-only' not in sys.argv:
    for name,liq,capcolor in variants:
        liquid.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*liq,1)
        capmat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(*capcolor,1)
        tex.image=bpy.data.images.load(os.path.join(OUT,'textures/label-'+name+'.png'))
        scene.render.filepath=os.path.join(OUT,'posters',name+'.png')
        bpy.ops.render.render(write_still=True)
# Save source scene with final studio setup; script remains the canonical editable source.
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'models/maison-bottle.blend'))
print('Maison Éclat generation complete.')
