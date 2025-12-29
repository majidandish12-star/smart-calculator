export async function loadModule(moduleName){
  const modulePath = `./modules/${moduleName}/index.js`;
  try{
    const mod = await import(modulePath);
    console.log('Module loaded:', moduleName, mod);
  }catch(e){
    console.warn('Module not found locally, placeholder for', moduleName);
  }
}
