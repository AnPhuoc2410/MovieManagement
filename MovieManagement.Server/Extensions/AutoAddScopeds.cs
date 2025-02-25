using System.Reflection;

namespace MovieManagement.Server.Extensions
{
    public static class AutoAddScopeds
    {
        // Hàm dùng để add các scoped một cách tự động
        // Với điều kiệ "ĐÚNG CONVENTION"
        //
        public static void AddAllDependencies(this IServiceCollection services, params string[] suffixes)
        {
            var assembly = Assembly.GetExecutingAssembly();
            foreach (var suffix in suffixes)
            {
                var types = assembly.GetTypes()
                    .Where(t => t.IsClass && !t.IsAbstract && t.Name.EndsWith(suffix));
                foreach (var type in types)
                {
                    var interfaceType = type.GetInterfaces().FirstOrDefault(i => i.Name == "I" + type.Name);
                    if (interfaceType != null)
                    {
                        services.AddScoped(interfaceType, type);
                    }
                }
            }
        }
    }
}
