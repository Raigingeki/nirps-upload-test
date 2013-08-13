Shader "Custom/LightmapSpecMap" {
	Properties {

    _Color ("Main Color", Color) = (1,1,1,1)

    _SpecColor ("Specular Color", Color) = (0.5, 0.5, 0.5, 1)

    _Shininess ("Shininess", Range (0.03, 1)) = 0.078125

    _MainTex ("Base (RGB)", 2D) = "white" {}

    _BumpMap ("Normalmap", 2D) = "bump" {}

    _LightMap ("Lightmap (RGB)", 2D) = "black" {}
    
    _SpecMap ("Specular map", 2D) = "black" {}

}

 

SubShader {

    LOD 200

    Tags { "RenderType" = "Opaque" }

CGPROGRAM

#pragma surface surf BlinnPhong

sampler2D _MainTex;

sampler2D _LightMap;

sampler2D _BumpMap;

sampler2D _SpecMap;

float4 _Color;

half _Shininess;


struct Input {

  float2 uv_MainTex;

  float2 uv_BumpMap;

  float2 uv2_LightMap;
  
  float2 uv_SpecMap;

};
 

void surf (Input IN, inout SurfaceOutput o)

{

  half4 tex = tex2D (_MainTex, IN.uv_MainTex);
  fixed4 specTex = tex2D(_SpecMap, IN.uv_SpecMap);
  o.Albedo = tex.rgb * _Color;

  half4 lm = tex2D (_LightMap, IN.uv2_LightMap);

  o.Emission = lm.rgb*o.Albedo.rgb;

  o.Gloss = tex.a;

  o.Alpha = lm.a * _Color.a;

  o.Specular = _Shininess * specTex.g;

  o.Normal = UnpackNormal(tex2D(_BumpMap, IN.uv_BumpMap));

}

ENDCG

}

FallBack "Legacy Shaders/Lightmapped/VertexLit"

}