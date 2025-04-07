using MovieManagement.Server.Data;
using System.Threading;

namespace MovieManagement.Server.Services
{
    public interface IUnitOfWorkFactory
    {
        IUnitOfWork Create();

        IServiceScope CreateScope();
    }

    public class UnitOfWorkFactory : IUnitOfWorkFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public UnitOfWorkFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public IUnitOfWork Create()
        {
            return _serviceProvider.GetRequiredService<IUnitOfWork>();
        }

        public IServiceScope CreateScope()
        {
            return _serviceProvider.CreateScope();
        }

    }

    public class SystemService : BackgroundService
    {
        private readonly ILogger<SystemService> _logger;
        private readonly IUnitOfWorkFactory _unitOfWorkFactory;
        private Timer _timer;

        public SystemService(ILogger<SystemService> logger, IUnitOfWorkFactory unitOfWorkFactory)
        {
            _logger = logger;
            _unitOfWorkFactory = unitOfWorkFactory;
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SystemService is starting.");

            stoppingToken.Register(() => _logger.LogInformation("SystemService is stopping."));

            ScheduleTask();

            return Task.CompletedTask;
        }

        private void ScheduleTask()
        {
            DateTime now = DateTime.Now;
            DateTime nextTwoAM = now.Date.AddDays(now.Hour >= 2 ? 1 : 0).AddHours(2); // Next occurrence of 2 AM
            TimeSpan timeToTwoAM = nextTwoAM - now;

            _logger.LogInformation($"Scheduling RemoveTicketDaily to run at {nextTwoAM} (in {timeToTwoAM}).");

            _timer = new Timer(RemoveTicketDaily, null, timeToTwoAM, TimeSpan.FromDays(1));
        }



        private async void RemoveTicketDaily(object state)
        {
            _logger.LogInformation("RemoveTicketDaily is running.");

            try
            {
                using (var scope = _unitOfWorkFactory.CreateScope())
                {
                    var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                    var tickets = await unitOfWork.TicketDetailRepository.GetRemainingsTickets();
                    foreach (var ticket in tickets)
                    {
                        unitOfWork.TicketDetailRepository.PrepareRemove(ticket);
                    }
                    await unitOfWork.TicketDetailRepository.SaveAsync();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while removing tickets.");
            }
        }


        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("SystemService is stopping.");

            _timer?.Change(Timeout.Infinite, 0);

            await base.StopAsync(cancellationToken);
        }
    }
}
